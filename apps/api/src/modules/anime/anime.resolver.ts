import { Inject, forwardRef } from "@nestjs/common";
import { Args, Info, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { fieldsList } from "graphql-fields-list";

import {
  Anime,
  AnimeCreateInput,
  AnimeUpdateInput,
  AnimeWhereUniqueInput,
} from "database/prisma";
import { AnimeService } from "services/anime.service";

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService
  ) {}

  @Query(() => [Anime])
  async animes(@Info() info: GraphQLResolveInfo) {
    const fields = fieldsList(info);
    return this.animeService.animes({
      include: {
        categories: fields.includes("categories"),
        episodes: fields.includes("episodes"),
      },
    });
  }

  @Query(() => Anime)
  async anime(
    @Args("id", { nullable: false }) id: number,
    @Info() info: GraphQLResolveInfo
  ) {
    const fields = fieldsList(info);
    return this.animeService.anime({
      where: { id },
      include: {
        categories: fields.includes("categories"),
        episodes: fields.includes("episodes"),
      },
    });
  }

  @Mutation(() => Anime)
  async createAnime(@Args("data") data: AnimeCreateInput) {
    return this.animeService.createAnime({ data });
  }

  @Mutation(() => Anime)
  async updateAnime(
    @Args("where", { nullable: false }) where: AnimeWhereUniqueInput,
    @Args("data") data: AnimeUpdateInput
  ) {
    return this.animeService.updateAnime({ where, data });
  }

  @Mutation(() => Anime)
  async deleteAnime(@Args("where") where: AnimeWhereUniqueInput) {
    return this.animeService.deleteAnime({ where });
  }
}
