import { Module } from "@nestjs/common";

import { PrismaService } from "services/prisma.service";

import { PhoneAuthResolver } from "./phone-auth.resolver";
import { PhoneAuthService } from "./phone-auth.service";

@Module({
  providers: [PhoneAuthService, PhoneAuthResolver, PrismaService],
  exports: [PhoneAuthService],
})
export class PhoneAuthModule {}
