import { Module } from "@nestjs/common";

import { PrismaService } from "services/prisma.service";
import { UserService } from "services/user.service";

import { UserResolver } from "./user.resolver";

@Module({
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
