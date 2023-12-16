import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusGatewayDriver } from '@nestjs/mercurius';
import AltairFastifyPlugin from 'altair-fastify-plugin';
import { MercuriusExtendedDriverConfig } from '@adapters/gql-driver/mercurius-extended-driver-config.interfaces';
import { GqlRegistryAdapter } from '@adapters/gql-registry/gql-registry.adapter';
import { GqlRegistryModule } from '@adapters/gql-registry/gql-registry.module';
import { ConfigModule } from '@config/config.module';
import { GatewayConfig } from '@config/gateway.config';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [
    ConfigModule,
    GqlRegistryModule,
    GraphQLModule.forRootAsync<MercuriusExtendedDriverConfig>({
      imports: [ConfigModule, GqlRegistryModule],
      driver: MercuriusGatewayDriver,
      useFactory: (configs: GatewayConfig, registry: GqlRegistryAdapter) => {
        const services = registry.services();
        return {
          queryDepth: configs.queryDepth,
          graphiql: false,
          ide: false,
          subscription: {
            verifyClient: (info, next) => next(true, null, null, {
              ip: info.req.headers.ip,
              'accept-language': info.req.headers['accept-language'],
              'user-agent': info.req.headers['user-agent'],
              authorization: info.req.headers.authorization,
            }),
          },
          plugins: [
            {
              plugin: (app, opts, done) => AltairFastifyPlugin(app, opts, done),
              options: {
                path: configs.playground,
                baseURL: `${configs.playground}/`,
                // 'endpointURL' should be the same as the mercurius 'path'
                endpointURL: configs.endpoint,
              },
            },
          ],
          gateway: {
            pollingInterval: 10000,
            defineMutation: true,
            services,
          },
        };
      },
      inject: [GatewayConfig, GqlRegistryAdapter],
    }),
    HealthModule,
  ],
})
export class AppModule {
}
