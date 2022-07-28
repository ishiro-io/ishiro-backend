import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Promise } from "bluebird";

import { AniListService } from "database/external-apis/anilist.service";
import { MediaSort } from "database/graphql/generated";
import { AnimeService } from "services/anime.service";

@Injectable()
export class UpdatePopularityTask {
  constructor(
    private readonly animeService: AnimeService,
    private readonly aniListService: AniListService
  ) {}

  private readonly logger = new Logger(UpdatePopularityTask.name);

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    const updatedAnimes = [];
    let page = 1;
    let hasNextPage = true;

    this.logger.log("Start updating popularity & score");

    while (hasNextPage) {
      this.logger.log(`Fetching page ${page}`);

      const data = await this.aniListService.fetchMediaDatabasePage({
        page,
        perPage: 50,
        sort: [MediaSort.PopularityDesc],
      });

      if (!data) {
        this.logger.error("No data");
        return;
      }

      const toUpdate = await Promise.filter(data.Page.media, async (media) => {
        const exists = await this.animeService.anime({
          where: { idAnilist: media.id },
        });

        return (
          !!exists &&
          (exists.popularityAnilist !== media.popularity ||
            exists.scoreAnilist !== media.averageScore)
        );
      });

      if (toUpdate.length > 0) {
        for (const media of toUpdate) {
          try {
            const anime = await this.animeService.updateAnime({
              where: { idAnilist: media.id },
              data: {
                popularityAnilist: media.popularity,
                scoreAnilist: media.averageScore,
              },
            });
            updatedAnimes.push(anime);
          } catch (error) {
            this.logger.error(error);
          }
        }
      }

      if (data.Page.pageInfo.hasNextPage) {
        page++;
      }

      hasNextPage = data.Page.pageInfo.hasNextPage ?? false;
    }

    this.logger.log(`Successfully updated ${updatedAnimes.length} animes`);
  }
}
