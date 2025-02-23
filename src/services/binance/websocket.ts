import { webSocket } from "rxjs/webSocket";
import { Observable, Subject, from } from "rxjs";
import { tap } from "rxjs/operators";
import { ENDPOINTS } from "./config";
import type { TradeWsMessage, DepthUpdate } from "./types";

export interface WebSocketConnection<T> {
  messages$: Observable<T>;
  close: () => void;
}

export const createTradeWebSocket = (
  symbol: string
): WebSocketConnection<TradeWsMessage> => {
  const wsSubject = webSocket<TradeWsMessage>({
    url: ENDPOINTS.wsTrades(symbol),
    openObserver: {
      next: () => console.log(`Trade WebSocket connected for ${symbol}`),
    },
    closeObserver: {
      next: () => console.log(`Trade WebSocket closed for ${symbol}`),
    },
  });

  return {
    messages$: wsSubject.asObservable(),
    close: () => wsSubject.complete(),
  };
};

export const createDepthWebSocket = (
  symbol: string
): WebSocketConnection<DepthUpdate> => {
  const wsSubject = new Subject<DepthUpdate>();
  let ws: WebSocket | null = null;
  let openResolver: (() => void) | null = null;

  const connect = () => {
    if (ws) {
      console.log("Closing existing WebSocket connection");
      ws.close();
    }

    ws = new WebSocket(ENDPOINTS.wsDepth(symbol));

    ws.onopen = () => {
      console.log(`Depth WebSocket connected for ${symbol}`);
      openResolver?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        wsSubject.next(data);
      } catch (err) {
        console.warn(`Failed to parse WebSocket message: ${err}`);
        wsSubject.error(err);
      }
    };

    ws.onerror = (err) => {
      console.warn(`WebSocket error for ${symbol}:`, err);
      wsSubject.error(err);
    };

    ws.onclose = () => {
      console.warn(`WebSocket closed unexpectedly for ${symbol}`);
      wsSubject.error(new Error("WebSocket closed"));
    };

    return ws;
  };

  const socket = connect();
  const socketReady = new Promise<void>((resolve) => {
    openResolver = resolve;
    if (socket.readyState === WebSocket.OPEN) {
      console.log(`WebSocket already open for ${symbol}`);
      resolve();
    }
  });

  return {
    messages$: from(socketReady).pipe(
      tap(() => console.log(`Socket ready for ${symbol}`)),
      // After socket is ready, start emitting messages
      () => wsSubject.asObservable()
    ),
    close: () => {
      if (ws) {
        ws.close();
        ws = null;
      }
      wsSubject.complete();
    },
  };
};
