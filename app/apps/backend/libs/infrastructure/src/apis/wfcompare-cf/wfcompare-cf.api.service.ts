import { Injectable } from '@nestjs/common';
import { InternalApi } from '../internal-api.abstract';

@Injectable()
export class WfCompareCfApiService extends InternalApi {
  constructor() {
    super('https://wfcompare.cf');
  }

  protected validateResponse<R = unknown>(response: any): R {
    if (response.data) {
      return response.data;
    }
  }
}
