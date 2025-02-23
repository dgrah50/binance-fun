import { toast } from "sonner";
import { ENDPOINTS } from "./config";
import type {
  Trade,
  BinanceTradeResponse,
  OrderBook,
  DepthSnapshot,
} from "./types";

export const fetchRecentTrades = async (symbol: string): Promise<Trade[]> => {
  try {
    const response = await fetch(ENDPOINTS.trades(symbol));
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: BinanceTradeResponse[] = await response.json();
    return data.map((trade) => ({
      id: trade.id,
      price: trade.price,
      quantity: trade.qty,
      time: trade.time,
      isBuyerMaker: trade.isBuyerMaker,
    }));
  } catch (error) {
    console.error(`Error fetching recent trades for ${symbol}:`, error);
    toast.error(`Failed to fetch recent trades for ${symbol}`);
    return [];
  }
};

export const fetchOrderBook = async (symbol: string): Promise<OrderBook> => {
  try {
    const response = await fetch(ENDPOINTS.depth(symbol));
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: DepthSnapshot = await response.json();

    return {
      bids: data.bids.map(([price, quantity]) => ({
        price,
        quantity,
      })),
      asks: data.asks.map(([price, quantity]) => ({
        price,
        quantity,
      })),
      lastUpdateId: data.lastUpdateId,
    };
  } catch (error) {
    console.error(`Error fetching order book for ${symbol}:`, error);
    toast.error(`Failed to fetch order book for ${symbol}`);
    throw error;
  }
};
