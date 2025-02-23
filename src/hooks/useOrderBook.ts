import { useState, useEffect, useMemo } from "react";
import { getOrderBookStream } from "@/services/binance";
import type {
  OrderBook,
  ProcessedOrderBook,
  OrderBookConfig,
} from "@/types/orderbook";

const roundToNearestBucket = (price: number, bucketSize: number): number => {
  return Math.round(price / bucketSize) * bucketSize;
};

export const useOrderBook = (market: string, config: OrderBookConfig) => {
  const [orderBook, setOrderBook] = useState<OrderBook>({
    bids: [],
    asks: [],
    lastUpdateId: 0,
  });

  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  useEffect(() => {
    const subscription = getOrderBookStream(market).subscribe({
      next: (newOrderBook) => {
        setOrderBook(newOrderBook);
        setLastUpdateTime(Date.now());
      },
      error: (error) => {
        console.error("Failed to subscribe to order book:", error);
      },
    });

    // Cleanup subscription on unmount or market change
    return () => {
      subscription.unsubscribe();
    };
  }, [market]);

  const processedOrderBook = useMemo<ProcessedOrderBook>(() => {
    if (orderBook.asks.length === 0 || orderBook.bids.length === 0) {
      return {
        bucketedAsks: [],
        bucketedBids: [],
        maxTotal: 0,
        spread: null,
      };
    }

    const allBuckets = new Map<number, { quantity: number; isAsk: boolean }>();

    // Process asks
    orderBook.asks.forEach((order) => {
      const price = parseFloat(order.price);
      const quantity = parseFloat(order.quantity);
      const bucketPrice = roundToNearestBucket(price, config.bucketSize);

      const existing = allBuckets.get(bucketPrice);
      if (existing) {
        if (existing.isAsk) {
          existing.quantity += quantity;
        } else if (quantity > existing.quantity) {
          existing.quantity = quantity;
          existing.isAsk = true;
        }
      } else {
        allBuckets.set(bucketPrice, { quantity, isAsk: true });
      }
    });

    // Process bids
    orderBook.bids.forEach((order) => {
      const price = parseFloat(order.price);
      const quantity = parseFloat(order.quantity);
      const bucketPrice = roundToNearestBucket(price, config.bucketSize);

      const existing = allBuckets.get(bucketPrice);
      if (existing) {
        if (!existing.isAsk) {
          existing.quantity += quantity;
        } else if (quantity > existing.quantity) {
          existing.quantity = quantity;
          existing.isAsk = false;
        }
      } else {
        allBuckets.set(bucketPrice, { quantity, isAsk: false });
      }
    });

    const askBuckets = [];
    const bidBuckets = [];

    for (const [price, value] of allBuckets) {
      const bucket = {
        price,
        quantity: value.quantity,
        total: price * value.quantity,
        orders: 1,
      };

      if (value.isAsk) {
        askBuckets.push(bucket);
      } else {
        bidBuckets.push(bucket);
      }
    }

    // Sort and slice to required bucket count
    const finalAsks = askBuckets
      .sort((a, b) => a.price - b.price)
      .slice(0, config.bucketCount);
    const finalBids = bidBuckets
      .sort((a, b) => b.price - a.price)
      .slice(0, config.bucketCount);

    const maxTotal = Math.max(
      ...finalAsks.map((ask) => ask.total),
      ...finalBids.map((bid) => bid.total)
    );

    // Calculate spread
    const minAsk = Math.min(...finalAsks.map((ask) => ask.price));
    const maxBid = Math.max(...finalBids.map((bid) => bid.price));
    const spread = minAsk - maxBid;

    return {
      bucketedAsks: finalAsks,
      bucketedBids: finalBids,
      maxTotal,
      spread,
    };
  }, [orderBook.asks, orderBook.bids, config.bucketSize, config.bucketCount]);

  // Check if data is stale (more than 5 seconds old)
  const isStale = Date.now() - lastUpdateTime > 5000;

  return {
    ...processedOrderBook,
    isStale,
    lastUpdateTime,
  };
};
