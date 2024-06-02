import { Injectable } from '@nestjs/common';
import { InternalApi } from '../internal-api.abstract';

@Injectable()
export class WfOnlineApiService extends InternalApi {
  constructor() {
    super('https://warface-statistics.firebaseio.com');
  }

  protected validateResponse<R = unknown>(response: any): R {
    if (response.data) {
      return response.data;
    }
  }

  async getPlayerInfo(nickname: string, server: string) {
    return this.send(
      'get',
      'playerInfo',
      {
        nickname,
        server,
      },
      { timeout: 1000 },
    );
  }

  async getOnlineStats(server: string) {
    const result = await this.send<{ all: number; pvp: number; pve: number }>('get', `summary/${server}.json`);

    return {
      pvp: result.pvp,
      pve: result.pve,
      all: result.all,
    };
  }
}
