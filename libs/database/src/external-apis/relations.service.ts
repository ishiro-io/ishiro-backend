import { Injectable } from "@nestjs/common";
import { $fetch } from "ohmyfetch";

import { AnimeService } from "services/anime.service";

@Injectable()
export class RelationsService {
  constructor(private readonly animeService: AnimeService) {}

  async updateRelations({ source, id }: RelationInput): Promise<void> {
    const relations = await this.fetchRelations({ source, id });

    await this.animeService.updateAnime({
      where: { id: Number(id) },
      data: {
        idAniDB: relations?.anidb,
        idKitsu: relations?.kitsu,
        idMal: relations?.myanimelist,
      },
    });
  }

  async fetchRelations({ source, id }: RelationInput) {
    return $fetch<RelationResponse | null>(
      `https://relations.yuna.moe/api/ids`,
      {
        parseResponse: JSON.parse,
        params: { source, id },
      }
    );
  }
}

type RelationInput = {
  source: RelationType;
  id: number;
};

export enum RelationType {
  anidb = "anidb",
  anilist = "anilist",
  myanimelist = "myanimelist",
  kitsu = "kitsu",
}

type RelationResponse = {
  anidb?: number;
  anilist?: number;
  myanimelist?: number;
  kitsu?: number;
};
