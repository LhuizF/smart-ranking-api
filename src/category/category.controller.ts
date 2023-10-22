import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { Category } from './interfaces/category.interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDTO: CreateCategoryDTO): Promise<Category> {
    return await this.categoryService.insert(createCategoryDTO);
  }

  @Get('/all')
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findById(id);
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string): Promise<void> {
    return await this.categoryService.deleteById(id);
  }

  @Post('/:categoryName/player/:playerId')
  async addPlayerToCategory(
    @Param('categoryName') categoryName: string,
    @Param('playerId') playerId: string
  ): Promise<any> {
    return await this.categoryService.addPlayerToCategory(categoryName, playerId);
  }
}
