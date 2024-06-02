import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { ExcludeLogging } from '@app/shared/decorators/exclude-logging.decorator';

@Controller({
  path: 'healthz',
})
@ExcludeLogging()
@ApiExcludeController()
export class HealthController {
  @Get()
  @HealthCheck()
  check() {}
}
