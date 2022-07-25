import { Field, ObjectType } from "@nestjs/graphql";

import { User } from "database/prisma";

@ObjectType()
export class PhoneConnectOutput {
  @Field({ nullable: true })
  user?: User;

  @Field()
  doesUserExists!: boolean;
}
