import { Module } from "@nestjs/common";

import { DoesUsernameAlreadyExistConstraint } from "api/validators";
import { PrismaService, UserService } from "services";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { PhoneAuthModule } from "./phone";

@Module({
  imports: [PhoneAuthModule],
  providers: [
    AuthService,
    AuthResolver,
    PrismaService,
    DoesUsernameAlreadyExistConstraint,
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
