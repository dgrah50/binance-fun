"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trade, getTradesStream } from "@/services/binance";
import { usePriceStore, updateDocumentTitle } from "@/store/priceStore";
import { useMarketStore } from "@/store/marketStore";
import { getMarketParts } from "@/lib/constants";
import { CurrencyToggle, CurrencyMode } from "@/components/ui/currency-toggle";

const TradeFeed = () => {
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

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getAmount = (trade: Trade) => {
    const quantity = parseFloat(trade.quantity);
    const price = parseFloat(trade.price);

    if (displayMode === "base") {
      return `${quantity.toFixed(4)} ${base}`;
    } else {
      return `${(quantity * price).toFixed(2)} ${quote}`;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Trades</h2>
        <CurrencyToggle
          mode={displayMode}
          onModeChange={setDisplayMode}
          base={base}
          quote={quote}
        />
      </div>
      <div className="grid">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-muted-foreground font-medium">Price</div>
          <div className="text-muted-foreground font-medium text-right">
            Amount
          </div>
          <div className="text-muted-foreground font-medium text-right">
            Time
          </div>
        </div>
        {trades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-3 gap-4">
            <div
              className={`${
                trade.isBuyerMaker ? "text-red-500" : "text-green-500"
              }`}
            >
              {parseFloat(trade.price).toFixed(2)}
            </div>
            <div
              className={`${
                trade.isBuyerMaker ? "text-red-500" : "text-green-500"
              } text-right`}
            >
              {getAmount(trade)}
            </div>
            <div
              className={`${
                trade.isBuyerMaker ? "text-red-500" : "text-green-500"
              } text-right`}
            >
              {formatTime(trade.time)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TradeFeed;
