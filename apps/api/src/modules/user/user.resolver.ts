import { Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import {
  User,
  UserCreateInput,
  UserUpdateInput,
  UserWhereUniqueInput,
} from "database/prisma";
import { UserService } from "services/user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  @Query(() => [User])
  async users() {
    return this.userService.users({});
  }

  @Query(() => User)
  async user(@Args("id", { nullable: false }) id: number) {
    return this.userService.user({ id });
  }

  @Mutation(() => User)
  async createUser(@Args("data") data: UserCreateInput) {
    return this.userService.createUser(data);
  }

  @Mutation(() => User)
  async updateUser(
    @Args("where", { nullable: false }) where: UserWhereUniqueInput,
    @Args("data") data: UserUpdateInput
  ) {
    return this.userService.updateUser({ where, data });
  }

  @Mutation(() => User)
  async deleteUser(@Args("where") where: UserWhereUniqueInput) {
    return this.userService.deleteUser(where);
  }
}
