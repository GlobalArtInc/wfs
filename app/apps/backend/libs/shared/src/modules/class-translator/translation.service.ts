import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';

import { isArray, isString, map, set } from 'lodash';
import { lastValueFrom } from 'rxjs';

import { ITranslateDecoratorValue, ITranslatorOptions } from './interfaces';
import { Language } from './language.class';
import { REMOTE_DICTS_TIMEOUT } from './translation.consts';
import { TRANSLATION_DECORATOR_KEY, TRANSLATOR_OPTIONS } from './translation.di-tokens';
import { Dict } from './types';

@Injectable()
export class TranslatorService implements OnModuleInit {
  private static dict: Dict = {};

  constructor(
    private readonly httpService: HttpService,
    @Inject(Logger) private readonly logger: Logger,
    @Inject(TRANSLATOR_OPTIONS) private readonly translatorOptions: ITranslatorOptions,
  ) {
    this.logger.log('Translator service initialized');
  }

  async onModuleInit() {
    await this.upsertFromRemote();
  }

  private getTranslatedText(key: string, lang: string, variables?: Record<string, unknown>): string {
    let dict = (TranslatorService.dict[lang]?.[key] || key) as string;

    const flattenVariables = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
      return Object.keys(obj).reduce(
        (acc, k) => {
          const pre = prefix.length ? `${prefix}.` : '';
          if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flattenVariables(obj[k] as Record<string, unknown>, `${pre}${k}`));
          } else {
            acc[`${pre}${k}`] = obj[k];
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );
    };

    if (variables) {
      const flatVariables = flattenVariables(variables);
      Object.keys(flatVariables).forEach((variable) => {
        const regex = new RegExp(`{{${variable}}}`, 'g');
        dict = dict.replace(regex, String(flatVariables[variable]));
      });
    }

    return dict;
  }

  localizationMapByKey(key: string) {
    return Object.entries(Language.Data).reduce((acc: any, [lang, value]) => {
      acc[lang] = this.getTranslatedText(key, value.translatorName || Language.DefaultTranslatorLanguage);
      return acc;
    }, {});
  }

  transformDictsToDsLocales() {
    return Object.entries(Language.Data).reduce((acc: Record<string, any>, [lang, value]) => {
      acc[lang] = TranslatorService.dict[value.translatorName || Language.DefaultTranslatorLanguage];

      return acc;
    }, {});
  }

  async upsertFromRemote(): Promise<any> {
    const requests = this.translatorOptions.remoteDicts.map((remoteDict) =>
      lastValueFrom(this.httpService.get(remoteDict.url, { timeout: REMOTE_DICTS_TIMEOUT })),
    );
    const responses = await Promise.all(requests);
    const remoteDicts = responses.map((response, index) => ({
      [this.translatorOptions.remoteDicts[index].prefix]: response.data,
    }));

    const newData: any = {};

    remoteDicts.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        Object.entries(value).forEach(([lang, val]) => {
          if (!newData[lang]) {
            newData[lang] = {};
          }
          const modifiedVal = Object.entries(val).reduce((acc: any, [subKey, subVal]) => {
            acc[`${key}.${subKey}`] = subVal;
            return acc;
          }, {});
          newData[lang] = { ...newData[lang], ...modifiedVal };
        });
      });
    });

    TranslatorService.dict = newData;
  }

  updateKey(key: string, value: string, lang: string): void {
    set(TranslatorService.dict, [lang, key], value);
  }

  translateNecessaryKeys(dto: object, lang: string): object {
    map(dto, (value, key) => {
      const translateDec: ITranslateDecoratorValue = Reflect.getMetadata(TRANSLATION_DECORATOR_KEY, dto, key);

      if (translateDec && isString(value)) {
        // Reflect.set(dto, key, this.translate(value, lang, translateDec.regex || null));

        return;
      }

      if (typeof value === 'object') {
        return this.translateNecessaryKeys(value, lang);
      }

      if (isArray(value)) {
        return map(value, (v) => {
          if (typeof v === 'object') {
            return this.translateNecessaryKeys(v, lang);
          }
        });
      }
    });

    return dto;
  }
}
