import { Global, Module } from '@nestjs/common';
import * as NestConfig from '@nestjs/config';
import { GatewayConfig } from '@config/gateway.config';
import { AppConfig } from './app.config';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfig.ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  providers: [
    NestConfig.ConfigService,
    ConfigService,
    AppConfig,
    GatewayConfig,
  ],
  exports: [
    AppConfig,
    GatewayConfig,
  ],
})
export class ConfigModule {}
