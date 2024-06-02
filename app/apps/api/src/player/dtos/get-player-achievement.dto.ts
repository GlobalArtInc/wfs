import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPlayerAchievementsDto {
  @ApiPropertyOptional({
    description: 'Retrive an progress for specific achievement',
    example: 'autumn2209_01_badge_name',
  })
  @Optional()
  progress?: string;
}
