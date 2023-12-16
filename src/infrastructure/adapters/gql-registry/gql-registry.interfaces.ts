export interface ISubgraphOpts {
  name: string;
  mandatory?: boolean;
  url: string;
  schema?: string;
  enabled?: boolean;
}

export interface IGQLRegistryAdapter {
  services(): Promise<ISubgraphOpts[]> | ISubgraphOpts[];
}
