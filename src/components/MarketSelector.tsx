"use client";

import { Button } from "@/components/ui/button";
import { MARKETS } from "@/lib/constants";
import { useMarketStore } from "@/store/marketStore";

const MarketSelector = () => {
  const { selectedMarket, setSelectedMarket } = useMarketStore();

  return (
    <div className="flex gap-2 mb-6">
      {MARKETS.map((market) => (
        <Button
          key={market}
          variant={selectedMarket === market ? "secondary" : "outline"}
          onClick={() => setSelectedMarket(market)}
          className="flex-1 sm:flex-none"
        >
          {market}
        </Button>
      ))}
    </div>
  );
};

export default MarketSelector;
