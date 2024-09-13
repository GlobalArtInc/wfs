import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import { DefaultLocalizationAdapter, LOCALIZATION_ADAPTER } from '@globalart/nestcord';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TranslationService {
  constructor(
    @Inject(LOCALIZATION_ADAPTER)
    private readonly localizationAdapter: DefaultLocalizationAdapter,
    private readonly requestClsService: RequestClsService,
  ) {}

  get(key: string, placeholder?: unknown) {
    return this.localizationAdapter.getTranslation(key, this.requestClsService.getUserLang(), placeholder);
  }
}
