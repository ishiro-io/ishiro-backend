import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-core";
import { ApolloError } from "apollo-server-core";

import {
  ERROR_CREATING_USER,
  INVALID_CONFIRMATION_CODE,
} from "api/constants/errorMessages";
import { IshiroContext } from "api/interfaces/Context";
import { User } from "database/prisma";

import {
  PhoneAskConfirmationCodeInput,
  PhoneConnectInput,
  PhoneRegisterInput,
} from "./phone-auth.input";
import { PhoneConnectOutput } from "./phone-auth.output";
import { PhoneAuthService } from "./phone-auth.service";

@Resolver(() => User)
export class PhoneAuthResolver {
  constructor(private readonly phoneAuthService: PhoneAuthService) {}

  @Mutation(() => Boolean, { name: "phoneAskConfirmationCode" })
  async askConfirmationCode(
    @Args("input")
    { phoneNumber }: PhoneAskConfirmationCodeInput
  ): Promise<boolean> {
    return this.phoneAuthService.askConfirmationCode(phoneNumber);
  }

  @Mutation(() => PhoneConnectOutput, { name: "phoneConnect" })
  async connect(
    @Args("input")
    input: PhoneConnectInput,
    @Context() ctx: IshiroContext
  ): Promise<PhoneConnectOutput> {
    const check = await this.phoneAuthService.checkConfirmationCode(input);

    if (!check) throw new UserInputError(INVALID_CONFIRMATION_CODE);

    const auth = await this.phoneAuthService.phoneAuth({
      where: { phoneNumber: input.phoneNumber },
      include: { user: true },
    });

    if (!auth) return { doesUserExists: false };

    ctx.req.session.user = auth.user;

    return { user: auth.user, doesUserExists: true };
  }

  @Mutation(() => User, { name: "phoneRegister" })
  async register(
    @Args("input") input: PhoneRegisterInput,
    @Context() ctx: IshiroContext
  ): Promise<User> {
    const check = await this.phoneAuthService.checkConfirmationCode(input);

    if (!check) throw new UserInputError(INVALID_CONFIRMATION_CODE);

    const auth = await this.phoneAuthService.createPhoneAuth({
      data: {
        phoneNumber: input.phoneNumber,
        user: { create: { username: input.username } },
      },
      include: { user: true },
    });

    if (!auth.user) throw new ApolloError(ERROR_CREATING_USER);

    ctx.req.session.user = auth.user;

    return auth.user;
  }
}
