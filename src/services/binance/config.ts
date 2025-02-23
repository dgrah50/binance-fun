export const BASE_REST_URL = "https://api.binance.com/api/v3";
export const BASE_WS_URL = "wss://stream.binance.com:9443/ws";

export const ENDPOINTS = {
  trades: (symbol: string) =>
    `${BASE_REST_URL}/trades?symbol=${symbol}&limit=20`,
  depth: (symbol: string) =>
    `${BASE_REST_URL}/depth?symbol=${symbol}&limit=5000`,
  wsDepth: (symbol: string) =>
    `${BASE_WS_URL}/${symbol.toLowerCase()}@depth@100ms`,
  wsTrades: (symbol: string) => `${BASE_WS_URL}/${symbol.toLowerCase()}@trade`,
} as const;
