import { BadRequestException } from '@nestjs/common';
import { FilterQueryDto } from '../dtos';
import { FilterConditionOperatorsEnum } from '../enums';
import { plainToInstance } from 'class-transformer';
import { BaseEntity } from '@app/dal/base-entity';

export const transformToFilterQueryDto = <T extends BaseEntity>(value: string | string[]) => {
  value = value instanceof Array ? [...value] : [value];

  return value.map((val) => {
    const [field, operator, ...operands] = [
      ...val.split('||').slice(0, -1),
      ...val.split('||').slice(-1)[0].split(','),
    ];

    if (!(field && operator && operands?.length)) {
      throw new BadRequestException('Failed to recognize filter');
    }

    return plainToInstance(FilterQueryDto<T>, {
      field,
      operator: Object(FilterConditionOperatorsEnum)[operator.toUpperCase()] as FilterConditionOperatorsEnum,
      operands,
    });
  });
};
