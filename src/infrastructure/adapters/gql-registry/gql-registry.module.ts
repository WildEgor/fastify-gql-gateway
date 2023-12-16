import { Module } from '@nestjs/common';
import { GqlRegistryAdapter } from '@adapters/gql-registry/gql-registry.adapter';

@Module({
  providers: [GqlRegistryAdapter],
  exports: [GqlRegistryAdapter],
})
export class GqlRegistryModule {}
