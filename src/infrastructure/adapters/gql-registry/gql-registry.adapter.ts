import { readFileSync } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { IGQLRegistryAdapter, ISubgraphOpts } from '@adapters/gql-registry/gql-registry.interfaces';


/**
 * @class GqlRegistryAdapter
 * @description can be used to register all the services in the graphql registry like Graphql Hive
 */
@Injectable()
export class GqlRegistryAdapter implements IGQLRegistryAdapter {

  private readonly _logger: Logger;

  constructor() {
    this._logger = new Logger(GqlRegistryAdapter.name);
  }

  public services(): ISubgraphOpts[] {
    this._logger.debug('Read services configs');
    const raw = readFileSync('services.json').toString();
    const services: ISubgraphOpts[] = JSON.parse(raw);

    const opts = services.map((service) => ({
      ...service,
      setResponseHeaders: (reply: FastifyReply) => {
        reply.header('x-service-name', service.name);
      },
      rewriteHeaders: (headers: Record<string, unknown>): Record<string, unknown> => ({
        ip: headers.ip,
        'accept-language': headers['accept-language'],
        'user-agent': headers['user-agent'],
        authorization: headers.authorization,
      }),
    }));

    // this._logger.debug('Filter services configs', { services: opts });

    return opts.filter((o) => o?.enabled);
  }

}
