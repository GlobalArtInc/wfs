import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { FilterConditionOperatorsEnum } from '../enums';

export class FilterDto<T> {
  @IsString()
  @IsNotEmpty()
  field: keyof T;

  @IsEnum(FilterConditionOperatorsEnum)
  operator: FilterConditionOperatorsEnum;

  @IsString({ each: true })
  operands: string[];
}
