import { Observable, ReplaySubject, EMPTY, from } from "rxjs";
import {
  switchMap,
  map,
  take,
  bufferWhen,
  tap,
  catchError,
  finalize,
  retryWhen,
  delay,
  shareReplay,
  scan,
} from "rxjs/operators";
import type { OrderBook, DepthUpdate } from "./types";
import { fetchOrderBook } from "./rest";
import { createDepthWebSocket } from "./websocket";

// Helper to update price levels for bids or asks
const updateLevels = (
  levels: OrderBook["bids"] | OrderBook["asks"],
  updates: [string, string][]
) => {
  const levelMap = new Map(levels.map((level) => [level.price, level]));
  updates.forEach(([price, quantity]) => {
    if (parseFloat(quantity) === 0) {
      levelMap.delete(price);
    } else {
      levelMap.set(price, { price, quantity });
    }
  });
  // For bids descending, for asks you might sort ascending if needed.
  return Array.from(levelMap.values()).sort(
    (a, b) => parseFloat(b.price) - parseFloat(a.price)
  );
};

// Update procedure to apply a depth update to the order book
const applyDepthUpdate = (
  orderBook: OrderBook,
  update: DepthUpdate
): OrderBook => {
  // 1. Ignore update if its last update ID is less than our current update ID.
  if (update.u < orderBook.lastUpdateId) {
    return orderBook;
  }

  return {
    lastUpdateId: update.u,
    bids: updateLevels(orderBook.bids, update.b),
    asks: updateLevels(orderBook.asks, update.a),
  };
};

export const orderBookStreams: Record<string, Observable<OrderBook>> = {};

export const getOrderBookStream = (symbol: string): Observable<OrderBook> => {
  if (!orderBookStreams[symbol]) {
    console.log(`Creating new order book stream for ${symbol}`);

    // Open the WebSocket connection.
    const stream = createDepthWebSocket(symbol);
    // This subject will signal when to stop buffering.
    const bufferTrigger = new ReplaySubject<void>(1);

    // Capture the first update from the stream.
    const firstUpdate$ = stream.messages$.pipe(
      take(1),
      tap((update) =>
        console.log(`First update for ${symbol}: U=${update.U}, u=${update.u}`)
      )
    );

    // Buffer all messages until the snapshot is ready.
    const bufferedUpdates$ = stream.messages$.pipe(
      tap((update) =>
        console.log(
          `Buffering update for ${symbol}: U=${update.U}, u=${update.u}`
        )
      ),
      bufferWhen(() => bufferTrigger),
      take(1)
    );

    orderBookStreams[symbol] = firstUpdate$.pipe(
      // Once the first update is captured, fetch the snapshot.
      switchMap((firstUpdate) =>
        from(fetchOrderBook(symbol)).pipe(
          tap((snapshot) => {
            console.log(
              `Received snapshot for ${symbol}: lastUpdateId=${snapshot.lastUpdateId}`
            );
            // According to the spec, if snapshot.lastUpdateId is strictly less than the first update's U, it means the snapshot is outdated.
            if (snapshot.lastUpdateId < firstUpdate.U) {
              throw new Error(
                "Snapshot outdated: snapshot.lastUpdateId is less than first update's U"
              );
            }
            // Signal that buffering is complete.
            bufferTrigger.next();
          }),
          switchMap((snapshot) =>
            bufferedUpdates$.pipe(
              map((bufferedUpdates: DepthUpdate[]) => {
                // Discard any update where update.u is less than or equal to snapshot.lastUpdateId.
                const relevantUpdates = bufferedUpdates.filter(
                  (update) => update.u > snapshot.lastUpdateId
                );
                if (relevantUpdates.length > 0) {
                  // Validate that the first relevant update covers snapshot.lastUpdateId+1.
                  const firstRelevant = relevantUpdates[0];
                  const expectedUpdateId = snapshot.lastUpdateId + 1;
                  if (
                    !(
                      firstRelevant.U <= expectedUpdateId &&
                      expectedUpdateId <= firstRelevant.u
                    )
                  ) {
                    throw new Error(
                      "First buffered update does not cover snapshot.lastUpdateId+1"
                    );
                  }
                  // Sequentially apply all relevant buffered updates to the snapshot.
                  return relevantUpdates.reduce(
                    (book, update) => applyDepthUpdate(book, update),
                    snapshot
                  );
                }
                // No relevant buffered updates; continue with the snapshot.
                return snapshot;
              }),
              // Now switch to live updates, accumulating state with scan.
              switchMap((initialBook: OrderBook) =>
                stream.messages$.pipe(
                  scan(
                    (currentBook, update) =>
                      applyDepthUpdate(currentBook, update),
                    initialBook
                  )
                )
              )
            )
          )
        )
      ),
      catchError((err) => {
        console.error(`Order book error for ${symbol}:`, err);
        stream.close();
        // Rethrow the error to trigger retryWhen
        return throwError(err);
      }),
      finalize(() => {
        console.log(`Finalizing stream for ${symbol}`);
        stream.close();
        delete orderBookStreams[symbol];
      }),
      retryWhen((errors) =>
        errors.pipe(
          tap((error) =>
            console.log(`Stream error for ${symbol}, retrying:`, error)
          ),
          delay(1000)
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
  return orderBookStreams[symbol];
};
