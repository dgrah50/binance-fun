import { useState, useEffect } from "react";
import { Trade, getTradesStream } from "@/services/binance";
import { usePriceStore, updateDocumentTitle } from "@/store/priceStore";
import { useMarketStore } from "@/store/marketStore";
import { getMarketParts } from "@/lib/constants";
import { CurrencyMode } from "@/components/ui/currency-toggle";

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [displayMode, setDisplayMode] = useState<CurrencyMode>("base");
  const setLatestPrice = usePriceStore((state) => state.setLatestPrice);
  const selectedMarket = useMarketStore((state) => state.selectedMarket);
  const { base, quote } = getMarketParts(selectedMarket);

  useEffect(() => {
    const subscription = getTradesStream(selectedMarket).subscribe({
      next: (newTrades) => {
        setTrades(newTrades);
        if (newTrades.length > 0) {
          const latestPrice = newTrades[0].price;
          setLatestPrice(latestPrice);
          updateDocumentTitle(selectedMarket, latestPrice);
        }
      },
      error: (error) => console.error("Failed to subscribe to trades:", error),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedMarket, setLatestPrice]);

  const getAmount = (trade: Trade) => {
    const quantity = parseFloat(trade.quantity);
    const price = parseFloat(trade.price);

    if (displayMode === "base") {
      return `${quantity.toFixed(4)} ${base}`;
    } else {
      return `${(quantity * price).toFixed(2)} ${quote}`;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return {
    trades,
    displayMode,
    setDisplayMode,
    getAmount,
    formatTime,
    base,
    quote,
  };
};
