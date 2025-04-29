import type {InkClientConfig, PriceRequestMessage} from "./types.ts";
import {type CoingeckoPrices, fetchCoingeckoPrices} from "./coingecko-api.ts";
import {InkClient} from "@guigou/sc-rollup-ink5";
import {type HexString, Option} from "@guigou/sc-rollup-core";

type PriceResponseMessage = {
  respType: string;
  tradingPairId: number;
  price: bigint | null;
  errNo: number | null;
};

const TYPE_FEED = "feed"; // Adapt this constant if needed


export async function feedPrices(
  config: InkClientConfig,
  tradingPairs: PriceRequestMessage[]
): Promise<Option<HexString>> {


  const inkClient = new InkClient(config.rpc, config.address, config.pk);
  await inkClient.startSession();

  const prices = await fetchCoingeckoPrices(tradingPairs);

  for (const request of tradingPairs) {
    const tokenPrices = prices[request.token0];
    const priceStr = tokenPrices?.[request.token1];

    if (priceStr !== undefined) {
      let price: number;
      try {
        // Parse as float
        const parsed = parseFloat(priceStr);
        if (isNaN(parsed)) {
          throw new Error("Invalid number");
        }

        // Multiply to scale
        const scaled = BigInt(parsed) * 1_000_000_000_000_000_000n;

        // Prepare the response payload
        const message: PriceResponseMessage = {
          respType: TYPE_FEED,
          tradingPairId: request.tradingPairId,
          price: scaled,
          errNo: null,
        };

        const payload = encodeMessage(message);
        inkClient.addAction(payload);

      } catch (err) {
        console.error("failed to parse real number", err);
        // handle error response if needed
      }
    }
  }



  return await inkClient.commit();
}

function encodeMessage(message: PriceResponseMessage): HexString {

  Registry

}
