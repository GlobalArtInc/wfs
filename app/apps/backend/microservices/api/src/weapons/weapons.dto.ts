import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class getWeaponsDto {
  @ApiPropertyOptional({
    description: 'Retrieve a specific weapon by ID',
    example: 'ar02',
  })
  @Optional()
  weapon_id?: string;

  @ApiPropertyOptional({
    description: 'The term to search for. Can be a partial weapon name',
    example: 'AK-103',
  })
  @Optional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Limit of weapons',
    example: 100,
  })
  @Optional()
  limit?: number;
}
