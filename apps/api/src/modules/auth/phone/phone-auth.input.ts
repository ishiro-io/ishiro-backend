import { Field, InputType } from "@nestjs/graphql";

import {
  DOES_USERNAME_ALREADY_EXIST_ERROR,
  INVALID_PHONE_NUMBER_ERROR,
} from "api/constants/errorMessages";
import { DoesUsernameAlreadyExist, IsMobilePhone } from "api/validators";

@InputType()
export class PhoneAskConfirmationCodeInput {
  @Field()
  @IsMobilePhone({ message: INVALID_PHONE_NUMBER_ERROR })
  phoneNumber!: string;
}

@InputType()
export class PhoneConnectInput {
  @Field()
  @IsMobilePhone({ message: INVALID_PHONE_NUMBER_ERROR })
  phoneNumber!: string;

  @Field()
  code!: string;
}

@InputType()
export class PhoneRegisterInput {
  @Field()
  @IsMobilePhone({ message: INVALID_PHONE_NUMBER_ERROR })
  phoneNumber!: string;

  @Field()
  @DoesUsernameAlreadyExist({ message: DOES_USERNAME_ALREADY_EXIST_ERROR })
  username!: string;

  @Field()
  code!: string;
}
