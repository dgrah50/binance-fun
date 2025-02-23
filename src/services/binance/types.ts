// Public types
export type OrderBookEntry = {
  price: string;
  quantity: string;
};

export type OrderBook = {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdateId: number;
};

export type Trade = {
  id: number;
  price: string;
  quantity: string;
  time: number;
  isBuyerMaker: boolean;
};

// Internal types
export type DepthSnapshot = {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
};

export type DepthUpdate = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  U: number; // First update ID
  u: number; // Last update ID
  b: [string, string][]; // Bids to be updated
  a: [string, string][]; // Asks to be updated
};

export type BinanceTradeResponse = {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
};

export type TradeWsMessage = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: number; // Trade time
  m: boolean; // Is buyer maker
};
