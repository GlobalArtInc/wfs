import { applyDecorators, SetMetadata } from '@nestjs/common';

import { TRANSLATABLE_KEY } from '../translation.di-tokens';
import { ClassConstructor, Type } from 'class-transformer';

//eslint-disable-next-line @typescript-eslint/ban-types
export const Translatable = <T>(dto: ClassConstructor<T>, fieldPlacement?: string, fieldKey?: string) => {
  return applyDecorators(
    SetMetadata(TRANSLATABLE_KEY, dto),
    SetMetadata(Translatable, `${fieldPlacement}.${fieldKey}`),
  );
};
