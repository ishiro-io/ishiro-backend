import { Inject, forwardRef } from "@nestjs/common";
import { Args, Info, Query, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { fieldsList } from "graphql-fields-list";

import { Anime } from "database/prisma";
import { AnimeService } from "services";

import { FetchAnimesArgs } from "./anime.args";

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService
  ) {}

  @Query(() => [Anime])
  async animes(
    @Args() args: FetchAnimesArgs,
    @Info() info: GraphQLResolveInfo
  ) {
    const fields = fieldsList(info);
    return this.animeService.animes({
      ...args,
      where: {
        ...args.where,
        OR: [{ isAdult: args.where?.isAdult }, { isAdult: false }],
      },
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
}
