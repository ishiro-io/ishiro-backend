import { Injectable } from "@nestjs/common";
import { AnimeFormat, AnimeSeason, AnimeStatus, Prisma } from "@prisma/client";
import { createClient } from "@urql/core";
import { mapSeries } from "bluebird";

import {
  AniListMediaPage,
  MediaPageFragment,
  MediaSort,
} from "database/graphql/generated";
import { CategoryService } from "services/category.service";
import sleep from "utils/sleep";

const MAX_RETRY = 10;

@Injectable()
export class AniListService {
  constructor(private readonly categoryService: CategoryService) {}

  async fetchMediaDatabase({
    pages = 1,
    firstPage = 1,
    perPage = 50,
    sort,
    indexCallback = () => null,
  }: FetchMediaDatabaseArgs) {
    const indexes = Array.from(
      { length: pages },
      (_, i) => i + Number(firstPage)
    );

    const data = await mapSeries(indexes, (i: number) => {
      indexCallback(i);
      return this.fetchMediaDatabasePage(i, perPage, sort);
    }).then((pages) =>
      pages.flat().filter((d): d is MediaPageFragment => d !== null)
    );

    return data;
  }

  async fetchMediaDatabasePage(
    page: number,
    perPage: number,
    sort: MediaSort[],
    retry = 0
  ): Promise<MediaPageFragment[] | null> {
    const client = createClient({
      url: "https://graphql.anilist.co",
    });

    const { data, error } = await client
      .query<AnilistMediaPage>(AniListMediaPage, { page, perPage, sort })
      .toPromise();

    if (error) {
      const { response } = error;
      const { headers, status } = response;

      const ratelimiteRemaining = headers.get("x-ratelimit-remaining");
      const ratelimiteReset = headers.get("x-ratelimit-reset");
      if (ratelimiteRemaining === "0" && ratelimiteReset && retry < MAX_RETRY) {
        const waitTime = Math.abs(ratelimiteReset * 1000 - Date.now());
        await sleep(waitTime);

        return this.fetchMediaDatabasePage(page, perPage, sort, retry + 1);
      }

      throw new Error(`HTTP Error ${status}`);
    }

    if (!data?.Page?.media) return null;

    return data.Page.media;
  }

  async formatMediaInputs(data: MediaPageFragment[]) {
    return mapSeries(data, (d) => this.formatMediaInput(d)).then((entries) =>
      entries.filter((input): input is Prisma.AnimeCreateInput => {
        return input !== null;
      })
    );
  }

  async formatMediaInput(
    entry: MediaPageFragment
  ): Promise<Prisma.AnimeCreateInput | null> {
    if (!entry.title?.english && !entry.title?.userPreferred) {
      return null;
    }

    let releaseDate: Date | null = null;
    let endDate: Date | null = null;

    if (
      entry.startDate &&
      entry.startDate.year &&
      entry.startDate.month &&
      entry.startDate.day
    ) {
      releaseDate = new Date(
        entry.startDate.year,
        entry.startDate.month - 1,
        entry.startDate.day,
        0,
        0,
        0,
        0
      );
    }

    if (
      entry.endDate &&
      entry.endDate.year &&
      entry.endDate.month &&
      entry.endDate.day
    ) {
      endDate = new Date(
        entry.endDate.year,
        entry.endDate.month - 1,
        entry.endDate.day,
        0,
        0,
        0,
        0
      );
    }

    const categories: string[] = [];
    if (entry.genres)
      categories.push(...entry.genres.filter((g): g is string => g !== null));
    if (entry.tags)
      categories.push(
        ...entry.tags
          .filter((t): t is { name: string } => t != null)
          .map((t) => t.name)
      );

    let categoriesId: Prisma.CategoryWhereUniqueInput[] = [];

    if (categories.length > 0) {
      categoriesId = await mapSeries(categories, (c) =>
        this.categoryService.categoryFromName(c)
      ).then((categories) =>
        categories
          .filter((input): input is number => {
            return input !== null;
          })
          .map((id) => {
            return { id };
          })
      );
    }

    const anime: Prisma.AnimeCreateInput = {
      idAnilist: entry.id,
      idMal: entry.idMal,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      title: (entry.title?.english ?? entry.title?.userPreferred)!,
      titleEnglish: entry.title?.english,
      titleRomaji: entry.title?.romaji,
      titleKanji: entry.title?.native,
      description: entry.description,
      coverImage: entry.coverImage?.extraLarge || entry.coverImage?.large,
      bannerImage: entry.bannerImage,
      format: entry.format as AnimeFormat,
      duration: entry.duration,
      status: entry.status as AnimeStatus,
      releaseDate: releaseDate,
      endDate: endDate,
      season: entry.season as AnimeSeason,
      seasonYear: entry.seasonYear,
      isAdult: entry.isAdult ?? false,
      popularityAnilist: entry.popularity,
      scoreAnilist: entry.averageScore,
    };

    if (categoriesId.length > 0) {
      anime.categories = { connect: categoriesId };
    }

    return anime;
  }
}

type FetchMediaDatabaseArgs = {
  pages?: number;
  firstPage?: number;
  perPage?: number;
  sort: MediaSort[];
  indexCallback?: (index: number) => void;
};

type AnilistMediaPage = {
  Page: {
    media: MediaPageFragment[];
  };
};
