import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export interface ITranslatorOptions {
  defaultTranslation?: boolean;
  logging?: boolean;
  remoteDicts: { projectId: number; prefix: string; url: string }[];
  langEnum: unknown;
  defaultLang: string;
}

export type TranslatorAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ITranslatorOptions>, 'useFactory' | 'inject'>;
