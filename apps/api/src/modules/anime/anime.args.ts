import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { Max, Min } from "class-validator";

import {
  AnimeOrderByWithRelationInput,
  AnimeWhereInput,
} from "database/prisma";

@ArgsType()
export class FetchAnimesArgs {
  @Field(() => AnimeWhereInput, { nullable: true })
  @Type(() => AnimeWhereInput)
  where?: InstanceType<typeof AnimeWhereInput>;

  @Field(() => [AnimeOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<AnimeOrderByWithRelationInput>;

  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(20)
  take = 10;
}
