import { Injectable } from "@nestjs/common";
import { Anime, Prisma } from "@prisma/client";

import { PrismaService } from "./prisma.service";

@Injectable()
export class AnimeService {
  constructor(private prisma: PrismaService) {}

  async anime(args: Prisma.AnimeFindUniqueArgs): Promise<Anime | null> {
    return this.prisma.anime.findUnique(args);
  }

  async animes(args: Prisma.AnimeFindManyArgs): Promise<Anime[]> {
    return this.prisma.anime.findMany(args);
  }

  async createAnime(args: Prisma.AnimeCreateArgs): Promise<Anime> {
    return this.prisma.anime.create(args);
  }

  async updateAnime(args: Prisma.AnimeUpdateArgs): Promise<Anime> {
    return this.prisma.anime.update(args);
  }

  async deleteAnime(args: Prisma.AnimeDeleteArgs): Promise<Anime> {
    return this.prisma.anime.delete(args);
  }

  async deleteAnimes(
    args?: Prisma.AnimeDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.anime.deleteMany(args);
  }
}
