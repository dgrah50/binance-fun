import { useState, useMemo, useCallback } from "react";
import type { CurrencyMode } from "@/components/ui/currency-toggle";
import { useOrderBook } from "@/hooks/useOrderBook";
import { getMarketParts, Market } from "@/lib/constants";

const BUCKET_COUNT = 10;

export const useOrderBookState = (selectedMarket: Market) => {
  const [displayMode, setDisplayMode] = useState<CurrencyMode>("base");
  const [bucketSize, setBucketSize] = useState(0.01);
  const { base, quote } = useMemo(
    () => getMarketParts(selectedMarket),
    [selectedMarket]
  );

  const { bucketedAsks, bucketedBids, maxTotal, spread, isStale } =
    useOrderBook(selectedMarket, {
      bucketSize,
      bucketCount: BUCKET_COUNT,
    });

  const handleDisplayModeChange = useCallback((mode: CurrencyMode) => {
    setDisplayMode(mode);
  }, []);

  const handleBucketSizeChange = useCallback((size: number) => {
    setBucketSize(size);
  }, []);

  return {
    displayMode,
    bucketSize,
    base,
    quote,
    bucketedAsks,
    bucketedBids,
    maxTotal,
    spread,
    isStale,
    onDisplayModeChange: handleDisplayModeChange,
    onBucketSizeChange: handleBucketSizeChange,
  };
};
