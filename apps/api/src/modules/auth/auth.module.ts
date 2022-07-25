import { Module } from "@nestjs/common";

import { DoesUsernameAlreadyExistConstraint } from "api/validators";
import { PrismaService } from "services/prisma.service";
import { UserService } from "services/user.service";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import PhoneAuthModule from "./phone/phone-auth.module";

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
class AuthModule {}

export default AuthModule;
