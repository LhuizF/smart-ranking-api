import { ChallengeStatus } from '../interfaces/challengeStatus.enum';
import { IsOptional } from 'class-validator';

export class UpdateChallengeDTO {
  @IsOptional()
  challengeDate: Date;

  @IsOptional()
  status: ChallengeStatus;
}
