import { Controller, Get, Query } from '@nestjs/common';
import { TopService } from '../top.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { MissionEnum } from '@app/shared/enums/mission.enums';

@ApiTags('top')
@Controller('top')
export class TopController {
  constructor(private readonly topService: TopService) {}

  @Get('mission')
  @ApiQuery({ name: 'name', enum: MissionEnum })
  getByMission(@Query('name') name: MissionEnum) {
    return this.topService.getByMission(name);
  }
}
