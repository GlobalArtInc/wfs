import { Module } from '@nestjs/common';

import { classTranslatorModuleConfig } from '../configs/class-translator.config';
import { ClassTranslatorModule } from '../modules/class-translator';

@Module({
  imports: [ClassTranslatorModule.forRootAsync(classTranslatorModuleConfig)],
})
export class TranslationModule {}
