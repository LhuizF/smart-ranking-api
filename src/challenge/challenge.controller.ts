import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDTO } from './dtos/createChallenge.dto';
import { UpdateChallengeDTO } from './dtos/updateChallenge.dto';
import { Challenge } from './interfaces/challenge.interfaces';
import { ChallengeStatusPipe } from './pipes/challengeStatus,pipe';
import { challengeMatchDTO } from './dtos/challengeMatch.dto';

@Controller('/challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @Post()
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDTO
  ): Promise<Challenge> {
    return await this.challengeService.create(createChallengeDto);
  }

  @Get()
  async getAll(): Promise<Challenge[]> {
    return await this.challengeService.getAll();
  }

  @Get('/:id_challenge')
  async getById(@Param('id_challenge') idChallenge: string): Promise<Challenge> {
    return await this.challengeService.getById(idChallenge);
  }

  @Get('/player/:id_player')
  async getChallengeByPlayerId(
    @Param('id_player') idPlayer: string
  ): Promise<Challenge[]> {
    return await this.challengeService.getChallengeByPlayerId(idPlayer);
  }

  @Put('/:id_challenge')
  async updateChallenge(
    @Body(ChallengeStatusPipe) updateChallengeDTO: UpdateChallengeDTO,
    @Param('id_challenge') id: string
  ): Promise<void> {
    await this.challengeService.updateChallenge(id, updateChallengeDTO);
  }

  @Post('/:id_challenge/match')
  async createMatch(
    @Body() challengeMatchDTO: challengeMatchDTO,
    @Param('id_challenge') id: string
  ): Promise<void> {
    await this.challengeService.createMatch(id, challengeMatchDTO);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.challengeService.cancelChallenge(id);
  }
}
