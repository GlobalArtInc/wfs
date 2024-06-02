import { Type } from 'class-transformer';
import { Equals, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

import { TranslatorEventDto } from './translator-event.dto';

const UPDATE_KEY_EVENT_NAME = 'update_key';

export class UpdateTranslateEventDataDto {
  @IsNotEmpty()
  @IsNumber()
  eventTs: number;

  @IsNotEmpty()
  @IsString()
  keyName: string;

  @IsNotEmpty()
  @IsString()
  keyValue: string;

  @IsNotEmpty()
  @IsString()
  langName: string;

  @IsNotEmpty()
  @Equals(UPDATE_KEY_EVENT_NAME)
  eventName: typeof UPDATE_KEY_EVENT_NAME;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}

export class UpdateTranslateEventDto extends TranslatorEventDto {
  @ValidateNested()
  @Type(() => UpdateTranslateEventDataDto)
  data: UpdateTranslateEventDataDto;
}
