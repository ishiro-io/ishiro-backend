import { Injectable } from "@nestjs/common";
import { $fetch } from "ohmyfetch";

@Injectable()
export class RelationsService {
  async fetchRelations({ source, id }: RelationInput) {
    return $fetch<RelationResponse>(`https://relations.yuna.moe/api/ids`, {
      parseResponse: JSON.parse,
      params: { source, id },
    });
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
  anidb: number;
  anilist: number;
  myanimelist: number;
  kitsu: number;
};
