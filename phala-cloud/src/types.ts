
export type InkClientConfig = {
  rpc: string;
  address: string;
  pk: string;
}

export type PriceRequestMessage = {
  tradingPairId: number;
  token0: string;
  token1: string;
}
