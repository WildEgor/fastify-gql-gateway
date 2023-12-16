export interface IAppConfig {
  name: string;
  port: number;
  isProduction: boolean;
}

export interface IGatewayConfig {
  endpoint: string;
  playground: string;
  queryDepth: number;
}
