import { ExcludeLogging } from '@app/shared/decorators/exclude-logging.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller({
  path: 'healthz',
})
@ExcludeLogging()
@ApiExcludeController()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      async () => this.http.pingCheck('google', 'https://www.google.com'),
      async () => this.http.pingCheck('discord', 'https://discord.com'),
    ]);
  }
}
