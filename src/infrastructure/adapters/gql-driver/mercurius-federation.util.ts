import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { transformSchema, BuildFederatedSchemaOptions } from '@nestjs/graphql';
import { FastifyInstance } from 'fastify';
import { GraphQLSchema, isObjectType, buildASTSchema } from 'graphql';
import { forEach } from 'lodash';
import { IMercuriusDriverPlugin } from '@adapters/gql-driver/mercurius-extended-driver-config.interfaces';

export class MercuriusFederationUtils {

  public static buildFederatedSchema({ typeDefs, resolvers }: BuildFederatedSchemaOptions): GraphQLSchema {
    const { buildSubgraphSchema, printSubgraphSchema } = loadPackage(
      '@apollo/subgraph',
      'MercuriusFederation',
      // eslint-disable-next-line global-require
      () => require('@apollo/subgraph'),
    );
    let executableSchema: GraphQLSchema = buildSubgraphSchema({
      typeDefs,
      resolvers,
    });

    const subscriptionResolvers = resolvers.Subscription;
    executableSchema = transformSchema(executableSchema, (type) => {
      if (isObjectType(type)) {
        const isSubscription = type.name === 'Subscription';
        forEach(type.getFields(), (value, key) => {
          if (isSubscription && subscriptionResolvers) {
            const resolver = subscriptionResolvers[key];
            if (resolver && !value.subscribe) {
              value.subscribe = resolver.subscribe;
            }
          }
          else if (key === '_service') {
            // Workaround for https://github.com/mercurius-js/mercurius/issues/273
            value.resolve = function resolve() {
              return {
                sdl: printSubgraphSchema(
                  buildASTSchema(typeDefs, {
                    assumeValid: true,
                  }),
                )
                  .replace('type Query {', 'type Query @extends {')
                  .replace('type Mutation {', 'type Mutation @extends {')
                  .replace('type Subscription {', 'type Subscription @extends {'),
              };
            };
          }
        });
      }
      return type;
    });

    return executableSchema;
  }

  public static async registerPluginsasync(
    app: FastifyInstance,
    plugins?: IMercuriusDriverPlugin[],
  ): Promise<void> {
    if (!plugins || plugins.length === 0) {
      return;
    }

    await Promise.all(plugins.map((plugin) => (app.register(plugin.plugin, plugin.options))));
  }

}
