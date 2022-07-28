import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphQLFormattedError } from "graphql";
import { GraphQLError } from "graphql";

import { PrismaService } from "services";

import { AnimeModule, AuthModule, CategoryModule } from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AnimeModule,
    CategoryModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: "/",
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error?.extensions as any)?.response?.message || error?.message,
        };

        return graphQLFormattedError;
      },
    }),
  ],
  providers: [PrismaService],
})
export class ApiModule {}
