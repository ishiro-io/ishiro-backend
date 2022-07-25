import { Context, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "api/decorators";
import { IshiroContext } from "api/interfaces/Context";
import { User } from "database/prisma";

import { AuthService } from "./auth.service";

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User, { name: "me", nullable: true })
  async me(@CurrentUser() user: User): Promise<User | undefined> {
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: IshiroContext): Promise<boolean> {
    return this.authService.logout(ctx);
  }
}
