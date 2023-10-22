import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { Category, CategoryDocument } from './interfaces/category.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlayerService } from '../player/player.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<CategoryDocument>,
    private readonly playerService: PlayerService
  ) {}

  async insert(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
    const category = new this.categoryModel(createCategoryDTO);
    await category.save();

    return this.cleanCategory(category);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().populate('players').exec();

    return categories.map((category) => this.cleanCategory(category));
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ _id: id })
      .populate('players')
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.cleanCategory(category);
  }

  async deleteById(id: string): Promise<void> {
    await this.categoryModel.deleteOne({ _id: id }).exec();
  }

  async addPlayerToCategory(categoryName: string, playerId: string): Promise<any> {
    const category: any = await this.categoryModel.findOne({ name: categoryName }).exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const playerInCategory = await this.categoryModel
      .find({ name: categoryName })
      .where('players')
      .in([playerId])
      .exec();

    if (playerInCategory.length > 0) {
      throw new NotFoundException('Player already in category');
    }

    await this.playerService.getPlayerById(playerId);

    category.players.push(playerId);

    await this.categoryModel
      .findOneAndUpdate({ name: categoryName }, { $set: category })
      .exec();
  }

  private cleanCategory(category: CategoryDocument): Category {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      events: category.events.map((event) => ({
        name: event.name,
        operation: event.operation,
        value: event.value,
      })),
      players: category.players.map((player) => ({
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone,
        ranking: player.ranking,
        rankingPosition: player.rankingPosition,
        urlPhoto: player.urlPhoto,
      })),
    };
  }

  async getCategoriesByPlayerId(id: string): Promise<Category> {
    const player = await this.playerService.getPlayerById(id);

    if (!player) {
      throw new BadRequestException(`O id ${id} não é um jogador!`);
    }

    const categoria = await this.categoryModel.findOne().where('players').in([id]).exec();

    return categoria;
  }
}
