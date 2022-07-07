import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { PrismaService } from "services/prisma.service";

import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaService,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: "/",
      introspection: true,
      playground: true,
    }),
  ],
})
class ApiModule {}

export default ApiModule;
