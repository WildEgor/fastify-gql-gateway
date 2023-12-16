import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckQuery } from '@modules/health/application/queries/health-check.query';
import { ApiHealth } from '@modules/health/infrastructure/api/health.api';

@Controller('health-check')
@ApiTags('Health Check Controller')
export class HealthController {

  constructor(private readonly _queryBus: QueryBus) {
  }

  @ApiHealth()
  @Get()
  public async health(): Promise<void> {
    await this._queryBus.execute(new HealthCheckQuery({}));
  }

}
