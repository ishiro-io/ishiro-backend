import { Command, Console, createSpinner } from "nestjs-console";

import {
  AniDBService,
  AniListService,
  RelationType,
  RelationsService,
} from "database/external-apis";
import { MediaSort } from "database/graphql/generated";
import { AnimeService, CategoryService, EpisodeService } from "services";

@Console()
export class CliService {
  constructor(
    private readonly aniDbService: AniDBService,
    private readonly aniListService: AniListService,
    private readonly animeService: AnimeService,
    private readonly categoryService: CategoryService,
    private readonly episodeService: EpisodeService,
    private readonly relationsService: RelationsService
  ) {}

  @Command({
    command: "clear-anime-database",
    alias: "c-a-d",
  })
  async clearAnimeDatabase() {
    const spinner = createSpinner();

    spinner.start(`Clearing anime database...`);
    try {
      await this.animeService.deleteAnimes();
      spinner.succeed("Cleared anime database!");
    } catch (error) {
      spinner.fail("Failed to clear anime database.");
      console.error(error);
    }
  }

  @Command({
    command: "init-category-database",
    alias: "i-c-d",
  })
  async initCategoryDatabase() {
    const spinner = createSpinner();
    spinner.start("Initializing category database...");

    try {
      await this.categoryService.initCategories();
      spinner.succeed("Category database initialized.");
    } catch (error) {
      spinner.fail("Category database initialization failed.");
      console.error(error);
    }
  }

  @Command({
    command: "update-anime-database",
    alias: "u-a-d",
    options: [
      {
        flags: "-p, --pages <pages>",
        required: false,
      },
      {
        flags: "-f, --firstPage <firstPage>",
        required: false,
      },
    ],
  })
  async updateAnimeDatabase({ pages = 1, firstPage = 1 }) {
    const spinner = createSpinner();
    spinner.start(`Fetching anilist anime database...`);

    const data = await this.aniListService.fetchMediaDatabase({
      pages,
      firstPage,
      sort: [MediaSort.PopularityDesc],
      indexCallback: (i) =>
        (spinner.text = `Fetching anilist anime database (Page ${i})...`),
    });

    if (!data) {
      spinner.fail("Failed to fetch anilist anime database!");
      return;
    } else {
      spinner.succeed("Fetched anilist anime database!");
    }

    spinner.start("Formatting entries...");
    const formattedInputs = await this.aniListService.formatMediaInputs(data);
    spinner.succeed(`Formatted entries!`);

    if (formattedInputs.length <= 0) {
      spinner.fail("No entries to update.");
      return;
    }

    spinner.start("Updating anime database...");
    try {
      const createdAnimes = [];
      const alreadyInDatabase = [];

      for (const input of formattedInputs) {
        try {
          const anime = await this.animeService.createAnime({ data: input });
          createdAnimes.push(anime);
        } catch (error) {
          alreadyInDatabase.push(input);
        }
      }
      spinner.info(`Successfully added ${createdAnimes.length} animes`);

      if (alreadyInDatabase.length > 0) {
        spinner.info(`${alreadyInDatabase.length} animes already in database`);
      }

      spinner.succeed("Updated anime database!");
    } catch (error) {
      spinner.fail("Failed to update anime database.");
      console.error(error);
    }
  }

  @Command({
    command: "update-anime-episodes <id>",
    alias: "u-a-e",
  })
  async updateAnimeEpisodes(id: number) {
    const spinner = createSpinner();
    spinner.start(`Updating anime relations...`);
    try {
      await this.relationsService.updateRelations({
        source: RelationType.anidb,
        id,
      });
    } catch (error) {
      spinner.fail("Failed to update anime relations.");
      console.error(error);
      return;
    }
    spinner.succeed("Updated anime relations!");

    spinner.start(`Fetching anidb episodes for anime...`);
    const anime = await this.animeService.anime({ where: { id: Number(id) } });

    if (!anime) {
      spinner.fail("Failed to find anime in database!");
      return;
    }

    if (!anime.idAniDB) {
      spinner.fail("Failed to find AniDB id for this anime!");
      return;
    }

    const adbAnime = await this.aniDbService.getAnimeData(anime.idAniDB);
    spinner.succeed("Fetched anidb episodes for anime!");

    if (!adbAnime.episodes) {
      spinner.fail("Failed to find episodes for this anime!");
      return;
    }

    spinner.start("Formatting entries...");
    const formattedInputs = await this.aniDbService.formatInputs(
      adbAnime.episodes,
      anime.id
    );
    spinner.succeed(`Formatted entries!`);

    if (formattedInputs.length <= 0) {
      spinner.fail("No entries to update.");
      return;
    }

    spinner.start("Updating episode database...");
    try {
      const createdEpisodes = [];

      for (const input of formattedInputs) {
        const episode = await this.episodeService.createEpisode({
          data: input,
        });
        createdEpisodes.push(episode);
      }
      spinner.info(`Successfully added ${createdEpisodes.length} episodes`);

      spinner.succeed("Updated episode database!");
    } catch (error) {
      spinner.fail("Failed to update episode database.");
      console.error(error);
    }
  }
}
