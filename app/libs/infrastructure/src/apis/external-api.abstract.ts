import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import { InternalApi } from './internal-api.abstract';

@Injectable()
export abstract class ExternalApi extends InternalApi {
  async send<R = unknown>(
    method: Method,
    url: string,
    data?: object,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<R> {
    if (!this.baseUrl || !config) {
      throw new InternalServerErrorException('Wrong credentials for external api.');
    }

    return super.send(method, url, data, config);
  }
}
