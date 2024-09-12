import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClanService } from '../clan.service';

@ApiTags('clan')
@Controller('clan')
export class ClanController {
  constructor(private clanService: ClanService) {}

  @ApiOperation({ summary: 'Retrive detailed information about the clan' })
  @Get()
  getByName(@Query('name') name: string) {
    return this.clanService.getByName(name);
  }
}
