import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ConfigModule } from '@nestjs/config';

const mongooseParams: MongooseModuleOptions = {};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGOOSE_URL, mongooseParams),
    PlayerModule,
    CategoryModule,
    ChallengeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
