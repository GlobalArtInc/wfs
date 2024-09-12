// @ts-nocheck
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export abstract class InternalApi {
  @Inject(HttpService) protected httpService: HttpService;

  constructor(protected baseUrl: string) {}

  protected validateResponse<R = unknown>(response): R {
    return response;
  }

  async send<R = unknown>(
    method: Method,
    url: string,
    data?: object,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<R> {
    if (!this.baseUrl) {
      throw new InternalServerErrorException('Wrong url to internal api.');
    }
    const reqConfig: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}/${url}`,
      ...config,
    };

    switch (method) {
      case 'get':
        reqConfig.params = data;
        break;
      case 'post':
      case 'put':
      case 'patch':
        reqConfig.data = data;
        break;
      default:
        break;
    }

    return lastValueFrom(
      this.httpService.request(reqConfig).pipe(
        map((response: AxiosResponse<R>): R => {
          if (!response.data) {
            throw new InternalServerErrorException('Something went wrong');
          }

          return this.validateResponse<R>(response);
        }),
        catchError((error) => {
          throw new InternalServerErrorException(error.response.data || error.message);
        }),
      ),
    );
  }
}
