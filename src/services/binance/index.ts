// Export public types
export type { OrderBook, OrderBookEntry, Trade } from "./types";

// Export public functions
export { getOrderBookStream } from "./orderbook";
export { getTradesStream } from "./trades";

/**
 * Optional cleanup function. With shareReplay(refCount: true) active connections will
 * automatically close when no longer subscribed, but you can clear the caches if needed.
 */
export const cleanup = () => {
  // Re-export cleanup functionality from individual modules
  import("./orderbook").then((orderbook) => {
    Object.keys(orderbook.orderBookStreams).forEach(
      (key) => delete orderbook.orderBookStreams[key]
    );
  });
  import("./trades").then((trades) => {
    Object.keys(trades.tradesStreams).forEach(
      (key) => delete trades.tradesStreams[key]
    );
  });
};
