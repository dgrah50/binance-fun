import { Observable, from } from "rxjs";
import {
  switchMap,
  map,
  catchError,
  finalize,
  retryWhen,
  delay,
  startWith,
  scan,
  shareReplay,
  tap,
} from "rxjs/operators";
import type { Trade, TradeWsMessage } from "./types";
import { fetchRecentTrades } from "./rest";
import { createTradeWebSocket } from "./websocket";

// Cache the observables so that multiple subscriptions share the same connection
export const tradesStreams: Record<string, Observable<Trade[]>> = {};

export const getTradesStream = (symbol: string): Observable<Trade[]> => {
  if (!tradesStreams[symbol]) {
    const stream = createTradeWebSocket(symbol);

    // Transform WebSocket messages into Trade objects
    const wsTradesStream = stream.messages$.pipe(
      map((data: TradeWsMessage) => ({
        id: data.t,
        price: data.p,
        quantity: data.q,
        time: data.T,
        isBuyerMaker: data.m,
      }))
    );

    // Combine initial REST trades with WebSocket stream
    tradesStreams[symbol] = from(fetchRecentTrades(symbol)).pipe(
      catchError((error) => {
        console.error(`Error fetching initial trades for ${symbol}:`, error);
        return from([[] as Trade[]]);
      }),
      switchMap((initialTrades) =>
        wsTradesStream.pipe(
          scan<Trade, Trade[]>(
            (trades, newTrade) => [newTrade, ...trades].slice(0, 20),
            initialTrades
          ),
          startWith(initialTrades)
        )
      ),
      retryWhen((errors) =>
        errors.pipe(
          tap((error: Error) =>
            console.warn(`Trade stream error for ${symbol}:`, error)
          ),
          delay(1000)
        )
      ),
      finalize(() => {
        console.log(`Finalizing trade stream for ${symbol}`);
        stream.close();
        delete tradesStreams[symbol];
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  return tradesStreams[symbol];
};
