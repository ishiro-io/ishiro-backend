import { Injectable } from "@nestjs/common";
import { Episode, Prisma } from "@prisma/client";

import { PrismaService } from "./prisma.service";

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async episode(
    episodeWhereUniqueInput: Prisma.EpisodeWhereUniqueInput
  ): Promise<Episode | null> {
    return this.prisma.episode.findUnique({
      where: episodeWhereUniqueInput,
    });
  }

  async episodes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EpisodeWhereUniqueInput;
    where?: Prisma.EpisodeWhereInput;
    orderBy?: Prisma.EpisodeOrderByWithRelationInput;
  }): Promise<Episode[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.episode.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createEpisode(data: Prisma.EpisodeCreateInput): Promise<Episode> {
    return this.prisma.episode.create({
      data,
    });
  }

  async updateEpisode(params: {
    where: Prisma.EpisodeWhereUniqueInput;
    data: Prisma.EpisodeUpdateInput;
  }): Promise<Episode> {
    const { where, data } = params;
    return this.prisma.episode.update({
      data,
      where,
    });
  }

  async deleteEpisode(where: Prisma.EpisodeWhereUniqueInput): Promise<Episode> {
    return this.prisma.episode.delete({
      where,
    });
  }

  async deleteEpisodes(
    where?: Prisma.EpisodeWhereInput
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.episode.deleteMany({ where });
  }
}
