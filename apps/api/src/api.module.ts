import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { PrismaService } from "services/prisma.service";

import { AnimeModule } from "./modules/anime/anime.module";
import { CategoryModule } from "./modules/category/category.module";
import { EpisodeModule } from "./modules/episode/episode.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AnimeModule,
    CategoryModule,
    EpisodeModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: "/",
      introspection: true,
      playground: true,
    }),
  ],
  providers: [PrismaService],
})
export class ApiModule {}
