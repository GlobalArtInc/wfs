import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../player.service';
import { GetPlayerAchievementsDto } from '../dtos';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @ApiOperation({ summary: 'Retrieve detailed player stats' })
  @Get(':name')
  getByName(@Param('name') nickname: string) {
    return this.playerService.getByName(nickname);
  }

  @ApiOperation({ summary: 'Get data from online player' })
  @Get(':name/onlineInfo')
  getInfoFromOnlinePlayer(@Param('name') nickname: string) {
    return this.playerService.getInfoFromOnlinePlayer(nickname);
  }

  @ApiOperation({ summary: 'List of player missions' })
  @Get(':name/pve')
  getPlayerMissions(@Param('name') nickname: string) {
    return this.playerService.getMissions(nickname);
  }

  // @ApiOperation({
  //   summary: 'List all achievements on PVE for the specific player',
  // })
  // @Get(':name/pve/achievements')
  // getPlayerAchievementsOnPVE(@Param('name') nickname: string) {
  //   return this.playerService.getPlayerAchievementsOnPVE(nickname);
  // }

  // @ApiOperation({ summary: 'List of player achievements' })
  // @Post(':name/achievements')
  // getPlayerAchievements(
  //   @Param('name') nickname: string,
  //   @Body() dto: GetPlayerAchievementsDto,
  // ) {
  //   return this.playerService.getPlayerAchievements(nickname, dto);
  // }

  @ApiOperation({ summary: 'List of player achievements' })
  @Post(':name/achievements')
  getPlayerAchievements(@Param('name') nickname: string, @Body() dto: GetPlayerAchievementsDto) {
    return this.playerService.getPlayerAchievements(nickname, dto);
  }
}
