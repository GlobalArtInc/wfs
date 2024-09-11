import { Controller, Get, Param } from '@nestjs/common';
import { TopService } from '../top.service';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { MissionEnum } from '@app/shared/enums/mission.enums';

@ApiTags('top')
@Controller('top')
export class TopController {
  constructor(private readonly topService: TopService) {}

  @Get('missions/:name')
  @ApiParam({ name: 'name', enum: MissionEnum })
  getByMission(@Param('name') name: MissionEnum) {
    return this.topService.getByMission(name);
  }
}
