import { FilterConditionOperatorsEnum } from '../enums';

export class FilterQueryInputObject<T> {
  field: keyof T;
  operator: FilterConditionOperatorsEnum;
  operands: string[];
}
