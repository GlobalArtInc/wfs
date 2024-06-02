import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FilterConditionOperatorsEnum } from '../enums';
import { FilterQueryInputObject } from '../input-objects/filter-query.input-object';
import { BaseEntity } from '@app/dal/base-entity';

export class FilterQueryDto<T extends BaseEntity> implements FilterQueryInputObject<T> {
  @IsString()
  @IsNotEmpty()
  field: keyof T;

  @IsEnum(FilterConditionOperatorsEnum)
  operator: FilterConditionOperatorsEnum;

  @IsString({ each: true })
  operands: string[];
}
