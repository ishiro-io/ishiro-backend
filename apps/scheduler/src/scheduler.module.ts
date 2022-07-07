import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { AniDBService } from "database/external-apis/anidb.service";
import { AniListService } from "database/external-apis/anilist.service";
import { RelationsService } from "database/external-apis/relations.service";
import { AnimeService } from "services/anime.service";
import { CategoryService } from "services/category.service";
import { EpisodeService } from "services/episode.service";
import { PrismaService } from "services/prisma.service";

import { LastAddedAnimesTask } from "./tasks/last-added-animes.task";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot()],
  providers: [
    PrismaService,
    AnimeService,
    AniDBService,
    AniListService,
    CategoryService,
    EpisodeService,
    RelationsService,
    LastAddedAnimesTask,
  ],
})
export class SchedulerModule {}
