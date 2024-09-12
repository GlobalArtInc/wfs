import { WfOnlineApiService } from '@app/infrastructure/apis/wf-online/wf-online.api.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnlineService {
  constructor(public readonly wfOnlineApi: WfOnlineApiService) {}

  async getOnlineStatsFromServers() {
    const [ru, int] = await Promise.all([
      this.wfOnlineApi.getOnlineStats('ru-alpha'),
      this.wfOnlineApi.getOnlineStats('eu'),
    ]);

    return {
      ru,
      int,
    };
  }
}
