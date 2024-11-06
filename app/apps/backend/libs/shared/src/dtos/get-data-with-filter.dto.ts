import { BaseEntity } from '@app/dal/base-entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { MAX_QUERY_LIMIT } from '../constants';
import { transformToFilterQueryDto } from '../transformers';
import { OrderValue } from '../types';
import { FilterQueryDto } from './filter-query.dto';

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
