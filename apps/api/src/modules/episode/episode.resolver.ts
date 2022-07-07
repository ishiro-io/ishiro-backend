import { Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import {
  Episode,
  EpisodeCreateInput,
  EpisodeUpdateInput,
  EpisodeWhereUniqueInput,
} from "database/prisma";
import { EpisodeService } from "services/episode.service";

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(
    @Inject(forwardRef(() => EpisodeService))
    private readonly episodeService: EpisodeService
  ) {}

  @Query(() => [Episode])
  async episodes() {
    return this.episodeService.episodes({});
  }

  @Query(() => Episode)
  async episode(@Args("id", { nullable: false }) id: number) {
    return this.episodeService.episode({ id });
  }

  @Mutation(() => Episode)
  async createEpisode(@Args("data") data: EpisodeCreateInput) {
    return this.episodeService.createEpisode(data);
  }

  @Mutation(() => Episode)
  async updateEpisode(
    @Args("where", { nullable: false }) where: EpisodeWhereUniqueInput,
    @Args("data") data: EpisodeUpdateInput
  ) {
    return this.episodeService.updateEpisode({ where, data });
  }

  @Mutation(() => Episode)
  async deleteEpisode(@Args("where") where: EpisodeWhereUniqueInput) {
    return this.episodeService.deleteEpisode(where);
  }
}
