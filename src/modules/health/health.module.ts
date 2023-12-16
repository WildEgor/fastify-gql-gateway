import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckHandler } from '@modules/health/application/queries/health-check.handler';
import { HealthController } from './application/health.controller';

@Module({
  imports: [CqrsModule, TerminusModule],
  controllers: [HealthController],
  providers: [HealthCheckHandler],
})
export class HealthModule {}
