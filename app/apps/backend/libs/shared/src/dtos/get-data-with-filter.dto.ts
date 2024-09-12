import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { FilterQueryDto } from './filter-query.dto';
import { MAX_QUERY_LIMIT } from '../constants';
import { OrderValue } from '../types';
import { transformToFilterQueryDto } from '../transformers';
import { BaseEntity } from '@app/dal/base-entity';

export class GetDataWithFilterDto<T extends BaseEntity> {
  @ApiPropertyOptional()
  @Transform(({ value }: TransformFnParams) => +value)
  @IsNumber()
  @Max(MAX_QUERY_LIMIT)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @Transform(({ value }: TransformFnParams) => +value)
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({
    name: 'filter',
    type: String,
    isArray: true,
    example: ['product||$eq||core', 'createdAt||$between||2022-12-12,2023-12-12'],
  })
  @Transform(({ value }: { value: string | string[] }) => transformToFilterQueryDto<T>(value))
  @IsDefined()
  @IsOptional()
  filter: FilterQueryDto<T>[] = [];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  orderBy?: OrderValue;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  sortBy?: keyof T;
}
