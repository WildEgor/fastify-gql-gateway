import { GqlModuleOptions } from '@nestjs/graphql';
import {
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyRegisterOptions,
} from 'fastify';
import { MercuriusOptions } from 'mercurius';

export interface IMercuriusDriverPlugin<
  TOptions extends FastifyPluginOptions = Record<string, string>,
> {
  plugin:
  | FastifyPluginCallback<TOptions>
  | FastifyPluginAsync<TOptions>
  | Promise<{
    default: FastifyPluginCallback<TOptions>;
  }>;
  options?: FastifyRegisterOptions<TOptions>;
}

interface IMercuriusPlugins {
  plugins?: IMercuriusDriverPlugin[];
}

export type MercuriusExtendedDriverConfig = GqlModuleOptions &
MercuriusOptions &
IMercuriusPlugins;
