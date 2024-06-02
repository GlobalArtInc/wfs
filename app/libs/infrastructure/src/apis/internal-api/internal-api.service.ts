import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InternalApi } from '../internal-api.abstract';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalBotApiService extends InternalApi {
  constructor(configService: ConfigService) {
    super(configService.getOrThrow('common.apiUrl'));
  }

  protected validateResponse<R = unknown>(response: any): R {
    if (!response.data) {
      throw new InternalServerErrorException();
    }

    return response.data;
  }
}
