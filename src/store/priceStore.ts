import { create } from "zustand";
import { getMarketParts, Market } from "@/lib/constants";

interface PriceState {
  latestPrice: string | null;
  setLatestPrice: (price: string) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  latestPrice: null,
  setLatestPrice: (price: string) => {
    set({ latestPrice: price });
  },
}));

// Update document title when price changes
export const updateDocumentTitle = (market: Market, price: string | null) => {
  const { base } = getMarketParts(market);
  document.title = price
    ? `${base} $${parseFloat(price).toLocaleString()} | Mini Trade App`
    : "Mini Trade App";
};
