import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaService } from "services/prisma.service";

@Module({
  imports: [ConfigModule.forRoot(), PrismaService],
})
class SchedulerModule {}

export default SchedulerModule;
