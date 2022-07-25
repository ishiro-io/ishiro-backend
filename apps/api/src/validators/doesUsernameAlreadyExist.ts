import { Injectable } from "@nestjs/common";
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

import { UserService } from "services/user.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class DoesUsernameAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  validate(username: string) {
    return this.userService
      .user({ where: { username } })

      .then((user) => {
        if (user) return false;
        return true;
      });
  }
}

export const DoesUsernameAlreadyExist = (
  validationOptions?: ValidationOptions
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: DoesUsernameAlreadyExistConstraint,
    });
  };
};
