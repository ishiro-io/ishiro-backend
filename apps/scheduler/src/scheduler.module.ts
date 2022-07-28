import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

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

import { LastAddedAnimesTask, UpdatePopularityTask } from "./tasks";

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
    UpdatePopularityTask,
  ],
})
export class SchedulerModule {}
