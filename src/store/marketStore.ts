import { create } from "zustand";
import { MARKETS, Market } from "@/lib/constants";

interface MarketState {
  selectedMarket: Market;
  setSelectedMarket: (market: Market) => void;
}

// Update URL when market changes
const updateURL = (market: Market) => {
  const url = new URL(window.location.href);
  url.searchParams.set("market", market);
  window.history.pushState({}, "", url);
};

// Get initial market from URL or default to first market
const getInitialMarket = (): Market => {
  if (typeof window === "undefined") return MARKETS[0];
  const urlParams = new URLSearchParams(window.location.search);
  const marketFromURL = urlParams.get("market") as Market | null;
  return marketFromURL && MARKETS.includes(marketFromURL)
    ? marketFromURL
    : MARKETS[0];
};

export const useMarketStore = create<MarketState>((set) => ({
  selectedMarket: getInitialMarket(),
  setSelectedMarket: (market: Market) => {
    set({ selectedMarket: market });
    updateURL(market);
  },
}));
