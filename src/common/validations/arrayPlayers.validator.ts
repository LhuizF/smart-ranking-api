import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint()
export class ArrayPlayersValidator implements ValidatorConstraintInterface {
  validate(value: any[]) {
    return value.every((player) => player.id && typeof player.id === 'string');
  }

  defaultMessage(): string {
    return `Players devem ter id com obrigatório`;
  }
}

export const IsArrayPlayers = (options?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsArrayPlayers',
      target: object.constructor,
      propertyName: propertyName,
      options: options,
      constraints: [],
      validator: ArrayPlayersValidator,
    });
  };
};
