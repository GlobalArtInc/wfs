import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InternalApi } from '../internal-api.abstract';

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
