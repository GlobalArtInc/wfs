import { InternalServerErrorException } from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import * as merge from 'deepmerge';
import { ExternalApi } from './external-api.abstract';

export class BearerApi extends ExternalApi {
  protected token: string;

  async send<R = unknown>(
    method: Method,
    url: string,
    data?: object,
    config: Partial<AxiosRequestConfig> = {},
  ): Promise<R> {
    if (!this.token) {
      throw new InternalServerErrorException('Wrong credentials for bearer api.');
    }
    const mergedConfig = merge(config, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return super.send(method, url, data, mergedConfig);
  }
}
