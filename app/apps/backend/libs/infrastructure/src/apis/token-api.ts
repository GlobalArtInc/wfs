import { InternalServerErrorException } from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import * as merge from 'deepmerge';
import { ExternalApi } from './external-api.abstract';

export class TokenApi extends ExternalApi {
  protected token: string;
  protected secret: string;

  async send<R = unknown>(
    method: Method,
    url: string,
    data?: object,
    config: Partial<AxiosRequestConfig> = {},
  ): Promise<R> {
    if (!this.token || !this.secret) {
      throw new InternalServerErrorException('Wrong credentials for token api.');
    }
    const mergedConfig = merge(config, {
      headers: {
        Authorization: `Token ${this.token}`,
        'X-Secret': this.secret,
      },
    });

    return super.send(method, url, data, mergedConfig);
  }
}
