import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/challenge.interfaces';
import { Player } from '@/player/interfaces/player.interface';

export class challengeMatchDTO {
  @IsNotEmpty()
  winner: string;

  @IsNotEmpty()
  result: Result[];
}
