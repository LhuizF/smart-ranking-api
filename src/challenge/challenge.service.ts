import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MatchDocument,
  ChallengeDocument,
  Challenge,
} from './interfaces/challenge.interfaces';
import { Model } from 'mongoose';
import { CreateChallengeDTO } from './dtos/createChallenge.dto';
import { PlayerService } from '@/player/player.service';
import { ChallengeStatus } from './interfaces/challengeStatus.enum';
import { CategoryService } from '@/category/category.service';
import { UpdateChallengeDTO } from './dtos/updateChallenge.dto';
import { challengeMatchDTO } from './dtos/challengeMatch.dto';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<ChallengeDocument>,
    @InjectModel('Match') private readonly matchModel: Model<MatchDocument>,
    private readonly playerService: PlayerService,
    private readonly categoriasService: CategoryService
  ) {}

  private readonly logger = new Logger(ChallengeService.name);

  async create(createChallengeDto: CreateChallengeDTO): Promise<Challenge> {
    if (new Date(createChallengeDto.date).getTime() < new Date().getTime()) {
      throw new BadRequestException(`A data do desafio deve ser futura!`);
    }

    const players = await this.playerService.getPlayers();

    createChallengeDto.players.forEach((playerDTO) => {
      const playerFiltred = players.find((player) => player.id == playerDTO.id);

      if (!playerFiltred) {
        throw new BadRequestException(`O id ${playerDTO.id} não é um jogador!`);
      }
    });

    const [requester, ...rest] = createChallengeDto.players.filter(
      (player) => player.isRequester === true
    );

    if (!requester) {
      throw new BadRequestException(`É necessário um solicitante!`);
    }

    if (rest.length !== 0) {
      throw new BadRequestException(`Somente um jogador pode ser o solicitante!`);
    }

    const categoryPlayer = await this.categoriasService.getCategoriesByPlayerId(
      requester.id
    );

    if (!categoryPlayer) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`
      );
    }

    const challenge = {
      category: categoryPlayer.name,
      challengeDate: createChallengeDto.date,
      status: ChallengeStatus.PENDING,
      requestDate: new Date(),
      requester: requester.id,
      players: createChallengeDto.players.map((player) => player.id),
    };

    const challengeCreated: any = new this.challengeModel(challenge);

    await challengeCreated.save();

    return challengeCreated;
  }

  async getAll(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match');
  }

  async getById(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findOne({ _id: id });

    if (!challenge) {
      throw new NotFoundException(`Desafio ${id} não encontrado!`);
    }

    return challenge;
  }

  async getChallengeByPlayerId(idPlayer: string): Promise<Challenge[]> {
    const player = await this.playerService.getPlayerById(idPlayer);

    if (!player) {
      throw new BadRequestException(`O id ${idPlayer} não é um jogador!`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in([idPlayer])
      .populate('requester')
      .populate('players')
      .populate('match');
  }

  async updateChallenge(id: string, updateChallengeDTO: UpdateChallengeDTO) {
    const challenge = await this.challengeModel.findOne({ _id: id });

    if (!challenge) {
      throw new NotFoundException(`Desafio ${id} não encontrado!`);
    }

    if (updateChallengeDTO.status) {
      challenge.status = updateChallengeDTO.status;
      challenge.responseDate = new Date();
    }

    if (updateChallengeDTO.challengeDate) {
      challenge.challengeDate = updateChallengeDTO.challengeDate;
    }

    await this.challengeModel.findOneAndUpdate({ _id: id }, { $set: challenge });
  }

  async createMatch(id: string, challengeMatchDTO: challengeMatchDTO): Promise<void> {
    const challenge = await this.challengeModel.findOne({ _id: id }).populate('players');

    if (!challenge) {
      throw new NotFoundException(`Desafio ${id} não encontrado!`);
    }

    if (challenge.status !== ChallengeStatus.ACCEPT) {
      throw new BadRequestException(`Desafio precisa estar aceito!`);
    }
    console.log(challenge);
    const winnerPlayer = challenge.players.find(
      (player) => player.id === challengeMatchDTO.winner
    );

    if (!winnerPlayer) {
      throw new BadRequestException(`O vencedor precisa estar no desafio`);
    }

    const match = {
      category: challenge.category,
      players: challenge.players,
      winner: challengeMatchDTO.winner,
      results: challengeMatchDTO.result,
    };

    const matchCreated = new this.matchModel(match);
    await matchCreated.save();

    challenge.status = ChallengeStatus.DONE;
    challenge.match = matchCreated.id;

    try {
      await this.challengeModel.findOneAndUpdate({ _id: id }, { $set: challenge });
    } catch (error) {
      await this.matchModel.deleteOne({ _id: matchCreated.id });
      throw new InternalServerErrorException();
    }
  }

  async cancelChallenge(id: string): Promise<void> {
    const challenge = await this.challengeModel.findOne({ _id: id });

    if (!challenge) {
      throw new NotFoundException(`Desafio ${id} não encontrado!`);
    }

    if (challenge.status === ChallengeStatus.DONE) {
      throw new BadRequestException(`Desafio não pode ser cancelado!`);
    }

    challenge.status = ChallengeStatus.CANCELED;

    await this.challengeModel.findOneAndUpdate({ _id: id }, { $set: challenge });
  }
}
