import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { MatchSchema } from './interfaces/match.schema';
import { PlayerModule } from '@/player/player.module';
import { CategoryModule } from '@/category/category.module';
import { ArrayPlayersValidator } from '@/common/validations/arrayPlayers.validator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenge', schema: ChallengeSchema },
      { name: 'Match', schema: MatchSchema },
    ]),
    PlayerModule,
    CategoryModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService, ArrayPlayersValidator],
})
export class ChallengeModule {}
