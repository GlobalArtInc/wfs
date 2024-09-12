import { Module } from '@nestjs/common';

import { ClassTranslatorModule } from '../modules/class-translator';
import { classTranslatorModuleConfig } from '../configs/class-translator.config';

@Module({
  imports: [ClassTranslatorModule.forRootAsync(classTranslatorModuleConfig)],
})
export class TranslationModule {}
