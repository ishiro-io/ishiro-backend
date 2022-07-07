import { Injectable } from "@nestjs/common";
import { AnimeFormat, AnimeSeason, AnimeStatus, Prisma } from "@prisma/client";
import { mapSeries } from "bluebird";
import { gql, rawRequest } from "graphql-request";

import { CategoryService } from "services/category.service";
import sleep from "utils/sleep";

import { RelationType, RelationsService } from "./relations.service";

const MAX_RETRY = 10;

const AniListMediaPage = gql`
  query AniListMediaPage($page: Int!) {
    Page(page: $page, perPage: 50) {
      media(type: ANIME, format_not: MUSIC, sort: POPULARITY_DESC) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          extraLarge
        }
        bannerImage
        format
        duration
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        season
        seasonYear
        isAdult
        popularity
        averageScore
        genres
        tags {
          name
        }
      }
    }
  }
`;

@Injectable()
export class AniListService {
  constructor(
    private readonly relationsService: RelationsService,
    private readonly categoryService: CategoryService
  ) {}

  async fetchDatabase({
    pages = 1,
    firstPage = 1,
    indexCallback = () => null,
  }: FetchDatabaseArgs) {
    const indexes = Array.from(
      { length: pages },
      (_, i) => i + Number(firstPage)
    );

    const data = await mapSeries(indexes, (i: number) => {
      indexCallback(i);
      return this.fetchDatabasePage(i);
    }).then((pages) =>
      pages.flat().filter((d): d is AnilistMedia => d !== null)
    );

    return data;
  }

  async fetchDatabasePage(
    page: number,
    retry = 0
  ): Promise<AnilistMedia[] | null> {
    try {
      const { data } = await rawRequest<AnilistPage>(
        "https://graphql.anilist.co",
        AniListMediaPage,
        {
          page,
        }
      );

      return data.Page.media;
    } catch ({ response }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { headers, status }: any = response;
      const ratelimiteRemaining = headers.get("x-ratelimit-remaining");
      const ratelimiteReset = headers.get("x-ratelimit-reset");
      if (ratelimiteRemaining === "0" && ratelimiteReset && retry < MAX_RETRY) {
        const waitTime = Math.abs(ratelimiteReset * 1000 - Date.now());
        await sleep(waitTime);

        return this.fetchDatabasePage(page, retry + 1);
      }

      throw new Error(`HTTP Error ${status}`);
    }
  }

  async formatInputs(data: AnilistMedia[]) {
    return mapSeries(data, (d) => this.formatInput(d)).then((entries) =>
      entries.filter((input): input is Prisma.AnimeCreateInput => {
        return input !== null;
      })
    );
  }

  async formatInput(
    entry: AnilistMedia
  ): Promise<Prisma.AnimeCreateInput | null> {
    const relations = await this.relationsService.fetchRelations({
      source: RelationType.anilist,
      id: entry.id,
    });

    const releaseDate = new Date(
      entry.startDate.year,
      entry.startDate.month - 1,
      entry.startDate.day,
      0,
      0,
      0,
      0
    );
    const endDate = new Date(
      entry.endDate.year,
      entry.endDate.month - 1,
      entry.endDate.day,
      0,
      0,
      0,
      0
    );

    const categories = entry
      ? [...entry.genres, ...entry.tags?.map((t) => t.name)]
      : [];

    const categoriesId: Prisma.CategoryWhereUniqueInput[] = await mapSeries(
      categories,
      (c) => this.categoryService.categoryFromName(c)
    ).then((categories) =>
      categories
        .filter((input): input is number => {
          return input !== null;
        })
        .map((id) => {
          return { id };
        })
    );

    const anime: Prisma.AnimeCreateInput = {
      idAnilist: entry.id,
      idMal: entry.idMal,
      idAniDB: relations.anidb,
      idKitsu: relations.kitsu,
      title: entry.title?.english ?? entry.title?.userPreferred,
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
      isAdult: entry.isAdult,
      popularityAnilist: entry.popularity,
      scoreAnilist: entry.averageScore,
    };

    if (categoriesId.length > 0) {
      anime.categories = { connect: categoriesId };
    }

    return anime;
  }
}

type FetchDatabaseArgs = {
  pages?: number;
  firstPage?: number;
  indexCallback?: (index: number) => void;
};

type AnilistPage = {
  Page: {
    media: AnilistMedia[];
  };
};

type AnilistMedia = {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  description: string;
  coverImage: {
    large: string;
    extraLarge: string;
  };
  bannerImage: string;
  format: string;
  duration: number;
  status: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  season: string;
  seasonYear: number;
  isAdult: boolean;
  popularity: number;
  averageScore: number;
  genres: string[];
  tags: {
    name: string;
  }[];
};
