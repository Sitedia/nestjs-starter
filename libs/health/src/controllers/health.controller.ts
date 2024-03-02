import { ApplicationLogger } from '@company/logger';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly logger: ApplicationLogger,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const healthCheckResult = await this.health.check([]);
    this.logger.debug(`Status is ${healthCheckResult.status}`, HealthController.name);
    return healthCheckResult;
  }
}
