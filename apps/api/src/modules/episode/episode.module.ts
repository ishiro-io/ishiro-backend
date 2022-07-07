import { Module } from "@nestjs/common";

import { EpisodeService } from "services/episode.service";
import { PrismaService } from "services/prisma.service";

import { EpisodeResolver } from "./episode.resolver";

@Module({
  providers: [EpisodeService, EpisodeResolver, PrismaService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
