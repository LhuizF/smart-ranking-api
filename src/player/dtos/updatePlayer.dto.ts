import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatePlayerDTO {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly phone: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;
}
