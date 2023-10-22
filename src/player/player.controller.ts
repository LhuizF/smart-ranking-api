import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { CreatePlayerDTO } from '@/player/dtos/createPlayer.dto';
import { UpdatePlayerDTO } from '@/player/dtos/updatePlayer.dto';
import { Player } from '@/player/interfaces/player.interface';
import { PlayerService } from '@/player/player.service';
import { ValidationParamPipe } from '@/player/validators/player.validators';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async create(@Body() createPlayerDTO: CreatePlayerDTO): Promise<any> {
    return await this.playerService.savePlayer(createPlayerDTO);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updatePlayerDTO: UpdatePlayerDTO) {
    return await this.playerService.updatePlayer(id, updatePlayerDTO);
  }

  @Get('/all')
  async getPlayers(): Promise<Player[]> {
    return await this.playerService.getPlayers();
  }

  @Get('/:id')
  async getPlayer(@Param('id', ValidationParamPipe) id: string): Promise<Player> {
    return await this.playerService.getPlayerById(id);
  }

  @Delete('/:id')
  async deletePlayer(@Param('id') id: string): Promise<void> {
    return await this.playerService.deletePlayer(id);
  }
}
