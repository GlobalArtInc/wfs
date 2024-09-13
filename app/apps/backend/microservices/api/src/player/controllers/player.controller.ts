import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../player.service';
import { GetPlayerAchievementsDto } from '../dtos';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @ApiOperation({ summary: 'Retrieve detailed player stats' })
  @Get()
  getByName(@Query('name') nickname: string) {
    return this.playerService.getByName(nickname);
  }

  @ApiOperation({ summary: 'List of player missions' })
  @Get('pve')
  getPlayerMissions(@Query('name') nickname: string) {
    return this.playerService.getMissions(nickname);
  }

  @ApiOperation({ summary: 'List of player achievements' })
  @Post('achievements')
  getPlayerAchievements(@Query('name') nickname: string, @Body() dto: GetPlayerAchievementsDto) {
    return this.playerService.getPlayerAchievements(nickname, dto);
  }
}