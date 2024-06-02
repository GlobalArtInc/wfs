import { Type } from 'class-transformer';
import { Equals, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

import { TranslatorEventDto } from './translator-event.dto';

const CREATE_KEY_EVENT_NAME = 'create_key';

class CreateKeyValueDto {
  @IsNotEmpty()
  @IsString()
  langName: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

class CreateTranslateEventDataDto {
  @IsNotEmpty()
  @IsString()
  keyName: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateKeyValueDto)
  @ValidateNested()
  values: CreateKeyValueDto[];

  @IsNotEmpty()
  @Equals(CREATE_KEY_EVENT_NAME)
  eventName: typeof CREATE_KEY_EVENT_NAME;

  @IsNotEmpty()
  @IsNumber()
  eventTs: number;
}

export class CreateTranslateEventDto extends TranslatorEventDto {
  @ValidateNested()
  @Type(() => CreateTranslateEventDataDto)
  data: CreateTranslateEventDataDto;
}
