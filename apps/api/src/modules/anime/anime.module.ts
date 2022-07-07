import { Module } from "@nestjs/common";

import { AnimeService } from "services/anime.service";
import { PrismaService } from "services/prisma.service";

import { AnimeResolver } from "./anime.resolver";

@Module({
  providers: [AnimeService, AnimeResolver, PrismaService],
  exports: [AnimeService],
})
export class AnimeModule {}
