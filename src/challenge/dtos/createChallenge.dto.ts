import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsBoolean,
  IsString,
} from 'class-validator';
import { IsArrayPlayers } from '@/common/validations/arrayPlayers.validator';

export class CreateChallengeDTO {
  @IsNotEmpty()
  //@IsDateString()
  date: Date;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsArrayPlayers()
  players: {
    id: string;
    isRequester?: boolean;
  }[];
}
