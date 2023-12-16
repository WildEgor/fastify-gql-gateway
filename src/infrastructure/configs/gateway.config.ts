import { Injectable } from '@nestjs/common';
import { IGatewayConfig } from '@src/infrastructure/interfaces/config.interfaces';
import { ConfigService } from './config.service';

@Injectable()
export class GatewayConfig implements IGatewayConfig {

  public readonly endpoint: string;
  public readonly playground: string;
  public readonly queryDepth: number;

  constructor(configService: ConfigService) {
    this.endpoint = configService.getString('GQL_ENDPOINT');
    this.playground = configService.getString('GQL_PLAYGROUND_ENDPOINT');
    this.queryDepth = 10;
  }

}
