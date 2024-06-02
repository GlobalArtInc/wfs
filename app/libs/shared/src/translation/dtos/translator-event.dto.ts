import { Equals, IsNotEmpty, IsUUID } from 'class-validator';

import { TRANSLATOR_EVENT_TYPE } from '../constants';

export class TranslatorEventDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @Equals(TRANSLATOR_EVENT_TYPE)
  type: typeof TRANSLATOR_EVENT_TYPE;
}
