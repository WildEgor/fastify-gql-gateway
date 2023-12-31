import { Injectable } from '@nestjs/common';
import { IAppConfig } from '@src/infrastructure/interfaces/config.interfaces';
import { ConfigService } from './config.service';

@Injectable()
export class AppConfig implements IAppConfig {

  public readonly name: string;
  public readonly port: number;
  public readonly isProduction: boolean;

  constructor(configService: ConfigService) {
    this.name = configService.getString('APP_NAME');
    this.port = configService.getNumber('APP_PORT');
    this.isProduction = configService.getBoolean('APP_PRODUCTION');
  }

  public get baseUrl(): string {
    return process.platform === 'win32'
      ? `http://localhost:${this.port}`
      : `http://127.0.0.1:${this.port}`;
  }

}
