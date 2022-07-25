import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { PrismaService } from "./prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(args: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this.prisma.user.findFirst(args);
  }

  async users(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  async createUser(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async updateUser(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prisma.user.update(args);
  }

  async deleteUser(args: Prisma.UserDeleteArgs): Promise<User> {
    return this.prisma.user.delete(args);
  }
}
