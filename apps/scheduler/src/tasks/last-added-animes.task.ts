import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Promise } from "bluebird";

import { AniListService } from "database/external-apis";
import { MediaSort } from "database/graphql/generated";
import { AnimeService } from "services";

@Injectable()
export class LastAddedAnimesTask {
  constructor(
    private readonly animeService: AnimeService,
    private readonly aniListService: AniListService
  ) {}

  private readonly logger = new Logger(LastAddedAnimesTask.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log("Start recovering last added animes");

    const data = await this.aniListService.fetchMediaDatabase({
      perPage: 50,
      sort: [MediaSort.IdDesc],
    });

    const toAdd = await Promise.filter(data, async (media) => {
      const exists = await this.animeService.anime({
        where: { idAnilist: media.id },
      });
      return !exists;
    });

    if (toAdd.length <= 0) {
      this.logger.log("No new anime to add.");
      return;
    }

    const formattedInputs = await this.aniListService.formatMediaInputs(toAdd);
    if (formattedInputs.length <= 0) {
      return;
    }

    const createdAnimes = [];
    for (const input of formattedInputs) {
      try {
        const anime = await this.animeService.createAnime({ data: input });
        createdAnimes.push(anime);
      } catch (error) {
        this.logger.error(error);
      }
    }

    this.logger.log(`Successfully added ${createdAnimes.length} animes`);
  }
}
