export interface Order {
  price: string;
  quantity: string;
}

export interface OrderBook {
  bids: Order[];
  asks: Order[];
  lastUpdateId: number;
}

export interface BucketedOrder {
  price: number;
  quantity: number;
  total: number;
  orders: number;
}

export interface ProcessedOrderBook {
  bucketedAsks: BucketedOrder[];
  bucketedBids: BucketedOrder[];
  maxTotal: number;
  spread: number | null;
}

export type CurrencyMode = "base" | "quote";

export interface OrderBookConfig {
  bucketSize: number;
  bucketCount: number;
}
