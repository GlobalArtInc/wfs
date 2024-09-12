import { Injectable } from '@nestjs/common';
import { InternalApi } from '../internal-api.abstract';

@Injectable()
export class WfStatsCfApiService extends InternalApi {
  constructor() {
    super('https://api.wfstats.cf');
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
    const data = await this.send('get', `stats/${server}`);

    let result = {
      pvp: 0,
      pve: 0,
      all: 0,
    };

    for (let prop of Object.keys(data)) {
      if (prop.startsWith('pvp_')) {
        // @ts-ignore
        result.pvp += data[prop];
      } else if (prop.startsWith('pve_')) {
        // @ts-ignore
        result.pve += data[prop];
      }
    }

    return {
      ...result,
      all: result.pvp + result.pve,
    };
  }
}
