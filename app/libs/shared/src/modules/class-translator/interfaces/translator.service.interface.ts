export interface ITranslatorService {
  updateKey(key: string, value: string, lang: string): void;
  translate(key: string, lang?: string, regex?: RegExp | null): string;
  translateNecessaryKeys(dto: object, lang: string): object;
  upsertFromRemote(): Promise<void>;
}
