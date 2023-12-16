import { QueryHandler } from '@nestjs/cqrs';
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { IUseCase } from '@shared/interfaces/use-case.interface';
import { HealthCheckQuery } from './health-check.query';

@QueryHandler(HealthCheckQuery)
export class HealthCheckHandler implements IUseCase<unknown, HealthCheckResult> {

  constructor(
    private readonly _service: HealthCheckService,
  ) {
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  public async execute(cmd: HealthCheckQuery): Promise<HealthCheckResult> {
    const result = await this._service.check([]);
    return result;
  }

}
