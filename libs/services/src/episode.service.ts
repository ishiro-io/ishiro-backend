import { Injectable } from "@nestjs/common";
import { Episode, Prisma } from "@prisma/client";

import { PrismaService } from "./prisma.service";

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async episode(args: Prisma.EpisodeFindFirstArgs): Promise<Episode | null> {
    return this.prisma.episode.findFirst(args);
  }

  async episodes(args: Prisma.EpisodeFindManyArgs): Promise<Episode[]> {
    return this.prisma.episode.findMany(args);
  }

  async createEpisode(args: Prisma.EpisodeCreateArgs): Promise<Episode> {
    return this.prisma.episode.create(args);
  }

  async updateEpisode(args: Prisma.EpisodeUpdateArgs): Promise<Episode> {
    return this.prisma.episode.update(args);
  }

  async deleteEpisode(args: Prisma.EpisodeDeleteArgs): Promise<Episode> {
    return this.prisma.episode.delete(args);
  }

  async deleteEpisodes(
    args: Prisma.EpisodeDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.episode.deleteMany(args);
  }
}
