import { MissionEnum } from '@app/shared/enums';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TopService } from '../top.service';

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
