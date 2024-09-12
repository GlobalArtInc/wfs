import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getWeaponsDto } from './weapons.dto';
import { WeaponsService } from './weapons.service';

@ApiTags('weapons')
@Controller('weapons')
export class WeaponsController {
  constructor(private readonly service: WeaponsService) {}

  // @SwaggerDocumentation({
  //   endpointDescription: 'Get weapons',
  //   endpointSummary: 'Get weapons',
  // })
  @Post()
  getWeapons(@Body() dto: getWeaponsDto) {
    return this.service.getWeapons(dto);
  }
}
