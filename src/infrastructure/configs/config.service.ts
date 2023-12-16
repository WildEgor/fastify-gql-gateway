import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

interface IConfigService {
  getString(name: string): string;
  getNumber(name: string): number;
  getBoolean(name: string): boolean;
  getDate(name: string): Date;
}

@Injectable()
export class ConfigService implements IConfigService {

  private readonly configService: NestConfigService;

  constructor(configService: NestConfigService) {
    this.configService = configService;
  }

  private getValue(name: string): string {
    const value = this.configService.get<string>(name);
    if (!value) {
      throw new InternalServerErrorException(
        `${name} parameter does not specified format`,
      );
    }
    return value;
  }

  public getString(name: string): string {
    return this.getValue(name);
  }

  public getNumber(name: string): number {
    const value = this.getValue(name);
    return parseFloat(value);
  }

  public getBoolean(name: string): boolean {
    const value = this.getValue(name);

    const truly = value === 'true';
    const falsy = value === 'false';
    if (truly) {
      return true;
    }
    if (falsy) {
      return false;
    }

    throw new InternalServerErrorException(
      `${name} parameter does not specified correct boolean format`,
    );
  }

  public getDate(name: string): Date {
    const value = this.getValue(name);
    const date = new Date(value);

    const isValid = !Number.isNaN(date.getTime());
    if (isValid) {
      throw new InternalServerErrorException(
        `${name} parameter does not specified correct ISO date format`,
      );
    }

    return date;
  }

}
