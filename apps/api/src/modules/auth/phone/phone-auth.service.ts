import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import ms from "ms";

import { PHONE_NUMBER_CONFIRMATION_PREFIX } from "api/constants/redisPrefixes";
import { redisClient } from "api/utils";
import { PhoneAuth } from "database/prisma";
import { PrismaService } from "services/prisma.service";

import { PhoneConnectInput } from "./phone-auth.input";

@Injectable()
export class PhoneAuthService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(PhoneAuthService.name);

  async phoneAuth(
    args: Prisma.PhoneAuthFindFirstArgs
  ): Promise<PhoneAuth | null> {
    return this.prisma.phoneAuth.findFirst(args);
  }

  async createPhoneAuth(args: Prisma.PhoneAuthCreateArgs): Promise<PhoneAuth> {
    return this.prisma.phoneAuth.create(args);
  }

  private async createConfirmationCode(
    phoneNumber: string,
    prefix: string
  ): Promise<string> {
    // ? On créé un token fais de 6 chiffres
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // ? On enregistre l'id du user dans Redis avec le token prefixé pendant 7 jours
    await redisClient.set(prefix + token, phoneNumber, "EX", ms("7d"));

    return token;
  }

  async askConfirmationCode(phoneNumber: string): Promise<boolean> {
    try {
      const code = await this.createConfirmationCode(
        phoneNumber,
        PHONE_NUMBER_CONFIRMATION_PREFIX
      );

      //   await this.sendSMSNotification(code, phoneNumber);
      this.logger.verbose({ code });
    } catch (error) {
      this.logger.error(error);

      return false;
    }

    return true;
  }

  async checkConfirmationCode({
    phoneNumber,
    code,
  }: PhoneConnectInput): Promise<boolean> {
    const storedPhoneNumber = await redisClient.get(
      PHONE_NUMBER_CONFIRMATION_PREFIX + code
    );

    return phoneNumber === storedPhoneNumber;
  }
}
