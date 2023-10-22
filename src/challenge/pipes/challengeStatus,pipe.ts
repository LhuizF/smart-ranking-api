import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challengeStatus.enum';

export class ChallengeStatusPipe implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPT,
    ChallengeStatus.CANCELED,
    ChallengeStatus.DENIED,
    ChallengeStatus.DONE,
    ChallengeStatus.PENDING,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.allowedStatus.includes(status)) {
      throw new BadRequestException(`${status} is an invalid status`);
    }

    return value;
  }
}
