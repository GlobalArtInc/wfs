import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

import { TranslatorEventDto } from './translator-event.dto';

enum ClearCacheEventEnum {
  CREATE_LANG = 'create_lang',
}

export class ClearCacheEventDataDto {
  @IsNotEmpty()
  @IsNumber()
  eventTs: number;

  @IsNotEmpty()
  @IsEnum(ClearCacheEventEnum)
  eventName: ClearCacheEventEnum;
}

export class ClearCacheEventDto extends TranslatorEventDto {
  @ValidateNested()
  @Type(() => ClearCacheEventDataDto)
  data: ClearCacheEventDataDto;
}
