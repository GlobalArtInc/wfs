import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertLocalTranslateEventDto {
  @IsNotEmpty()
  @IsString()
  lang: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
