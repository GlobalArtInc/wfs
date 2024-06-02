import { Controller, Get, Param } from '@nestjs/common';
import { TopService } from '../top.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('top')
@Controller('top')
export class TopController {
  constructor(private readonly service: TopService) {}

  @Get('missions/:name')
  getByMission(@Param('name') name: string) {
    return this.service.getByMission(name);
  }
}
