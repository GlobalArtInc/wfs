import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OnlineService } from '../online.service';

@ApiTags('online')
@Controller('online')
export class OnlineController {
  constructor(public service: OnlineService) {}

  @Get()
  @ApiOperation({ summary: 'Show online stats from the servers' })
  getOnlineStatsFromServers() {
    return this.service.getOnlineStatsFromServers();
  }
}
