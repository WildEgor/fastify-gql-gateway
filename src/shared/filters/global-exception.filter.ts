import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  GqlArgumentsHost,
  GqlContextType,
  GqlExceptionFilter,
} from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

@Catch()
export class GlobalExceptionFilter
  extends BaseExceptionFilter
  implements GqlExceptionFilter {

  private readonly logger: Logger = new Logger();

  public override catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlArgumentsHost.create(host);
      const {
        req: { ip, body },
      } = ctx.getContext();
      this.logger.error(ip, exception, body);
    }
    else {
      super.catch(exception, host);
      const { ip, body } = host.switchToHttp().getRequest<FastifyRequest>();
      this.logger.error(ip, exception, body);
    }
  }

}
