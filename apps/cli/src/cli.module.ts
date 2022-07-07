import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConsoleModule } from "nestjs-console";

import { AniDBService } from "database/external-apis/anidb.service";
import { AniListService } from "database/external-apis/anilist.service";
import { RelationsService } from "database/external-apis/relations.service";
import { AnimeService } from "services/anime.service";
import { CategoryService } from "services/category.service";
import { EpisodeService } from "services/episode.service";
import { PrismaService } from "services/prisma.service";

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
