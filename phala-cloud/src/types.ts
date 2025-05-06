import type {KeyringPair} from "@polkadot/keyring/types";

export type InkClientConfig = {
  rpc: string;
  address: string;
  pk: string | KeyringPair;
}

export type PriceRequestMessage = {
  tradingPairId: number;
  token0: string;
  token1: string;
}
