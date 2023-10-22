import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from '@/player/dtos/createPlayer.dto';
import { UpdatePlayerDTO } from '@/player/dtos/updatePlayer.dto';
import { Player, PlayerDocument } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<PlayerDocument>
  ) {}

  async savePlayer(createPlayerDto: CreatePlayerDTO): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);
    await player.save();

    return this.cleanPlayer(player);
  }

  async updatePlayer(id: string, updatePlayerDTO: UpdatePlayerDTO): Promise<Player> {
    const { name, phone } = updatePlayerDTO;

    const updateResult = await this.playerModel
      .updateOne({ _id: id }, { name, phone })
      .exec();

    if (updateResult.modifiedCount === 0) {
      throw new NotFoundException('Player not found');
    }

    return await this.getPlayerById(id);
  }

  async getPlayers(): Promise<Player[]> {
    const players = await this.playerModel.find().exec();

    return players.map((player) => this.cleanPlayer(player));
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id: id }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return this.cleanPlayer(player);
  }

  async deletePlayer(id: string): Promise<void> {
    await this.playerModel.deleteOne({ _id: id }).exec();
  }

  private cleanPlayer(player: PlayerDocument): Player {
    return {
      id: player.id,
      email: player.email,
      name: player.name,
      phone: player.phone || null,
      ranking: player?.ranking || null,
      rankingPosition: player.rankingPosition || null,
      urlPhoto: player?.urlPhoto || null,
    };
  }
}
