"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import { useMarketStore } from "@/store/marketStore";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { DepthBucketSelector } from "@/components/ui/depth-bucket-selector";
import { useOrderBookState } from "@/hooks/useOrderBookState";
import OrderBookSection from "./OrderBookSection";

const StaleWarning = memo(() => (
  <div className="bg-yellow-500/10 text-yellow-500 p-2 mb-4 rounded text-sm">
    Order book data may be stale. Please check your connection.
  </div>
));

StaleWarning.displayName = "StaleWarning";

const SpreadIndicator = memo(
  ({ spread, quote }: { spread: number | null; quote: string }) => (
    <div className="border-t border-b border-border py-2 text-center text-sm text-muted-foreground">
      Spread: {spread ? `${spread.toFixed(3)} ${quote}` : "Loading..."}
    </div>
  )
);

SpreadIndicator.displayName = "SpreadIndicator";

const OrderBook = () => {
  const { selectedMarket } = useMarketStore();
  const {
    displayMode,
    bucketSize,
    base,
    quote,
    bucketedAsks,
    bucketedBids,
    maxTotal,
    spread,
    isStale,
    onDisplayModeChange,
    onBucketSizeChange,
  } = useOrderBookState(selectedMarket);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Order Book</h2>
          <DepthBucketSelector
            value={bucketSize}
            onChange={onBucketSizeChange}
          />
        </div>
        <CurrencyToggle
          mode={displayMode}
          onModeChange={onDisplayModeChange}
          base={base}
          quote={quote}
        />
      </div>

      {isStale && <StaleWarning />}

      <div className="flex flex-col gap-4">
        <OrderBookSection
          orders={bucketedAsks}
          maxTotal={maxTotal}
          bucketSize={bucketSize}
          displayMode={displayMode}
          type="ask"
          base={base}
          quote={quote}
        />

        <SpreadIndicator spread={spread} quote={quote} />

        <OrderBookSection
          orders={bucketedBids}
          maxTotal={maxTotal}
          bucketSize={bucketSize}
          displayMode={displayMode}
          type="bid"
          base={base}
          quote={quote}
        />
      </div>
    </Card>
  );
};

export default OrderBook;
