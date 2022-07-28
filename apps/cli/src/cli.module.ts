import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConsoleModule } from "nestjs-console";

import {
  AniDBService,
  AniListService,
  RelationsService,
} from "database/external-apis";
import {
  AnimeService,
  CategoryService,
  EpisodeService,
  PrismaService,
} from "services";

import { CliService } from "./cli.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ConsoleModule],
  providers: [
    CliService,
    PrismaService,
    AniDBService,
    AniListService,
    AnimeService,
    CategoryService,
    EpisodeService,
    RelationsService,
  ],
})
export class CliModule {}
