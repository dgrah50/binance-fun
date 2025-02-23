export type Market = "BTCUSDC" | "ETHUSDC" | "SOLUSDC";

export const MARKETS: Market[] = ["BTCUSDC", "ETHUSDC", "SOLUSDC"];

type MarketParts = {
  base: string;
  quote: string;
};

// Helper to get the base and quote currency from a market pair
export const getMarketParts = (market: Market): MarketParts => {
  const base = market.slice(0, -4); // e.g., "BTC" from "BTCUSDC"
  const quote = market.slice(-4); // e.g., "USDC" from "BTCUSDC"
  return { base, quote };
};
