import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaService } from "services/prisma.service";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService],
})
export class SchedulerModule {}
