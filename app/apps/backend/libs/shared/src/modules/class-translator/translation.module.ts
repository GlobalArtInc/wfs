import { HttpModule } from '@nestjs/axios';
import { type DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { TranslatorAsyncOptions, ITranslatorOptions } from './interfaces';
import { TRANSLATOR_OPTIONS } from './translation.di-tokens';
import { TranslatorService } from './translation.service';

export const logger = new Logger('TranslationService');

@Global()
@Module({})
export class ClassTranslatorModule {
  static forRoot(options: ITranslatorOptions): DynamicModule {
    return {
      module: ClassTranslatorModule,
      imports: [HttpModule],
      providers: [
        { provide: Logger, useValue: logger },
        {
          provide: TRANSLATOR_OPTIONS,
          useValue: options,
        },
        {
          provide: TranslatorService,
          useClass: TranslatorService,
        },
      ],
      exports: [
        {
          provide: TranslatorService,
          useClass: TranslatorService,
        },
      ],
    };
  }

  static forRootAsync(options: TranslatorAsyncOptions): DynamicModule {
    const imports = options.imports || [];

    return {
      module: ClassTranslatorModule,
      imports: [...imports, HttpModule],
      providers: [
        { provide: Logger, useValue: logger },
        {
          provide: TRANSLATOR_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: TranslatorService,
          useClass: TranslatorService,
        },
      ],
      exports: [
        {
          provide: TranslatorService,
          useClass: TranslatorService,
        },
      ],
    };
  }
}
