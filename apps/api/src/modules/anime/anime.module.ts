import { Module } from "@nestjs/common";

import { AnimeService, PrismaService } from "services";

import { AnimeResolver } from "./anime.resolver";

@Module({
  providers: [AnimeService, AnimeResolver, PrismaService],
  exports: [AnimeService],
})
export class AnimeModule {}
