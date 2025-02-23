import { Trade } from "@/services/binance";

interface TradeRowProps {
  trade: Trade;
  getAmount: (trade: Trade) => string;
  formatTime: (timestamp: number) => string;
}

export const TradeRow = ({ trade, getAmount, formatTime }: TradeRowProps) => {
  const priceColor = trade.isBuyerMaker ? "text-red-500" : "text-green-500";

  return (
    <div key={trade.id} className="grid grid-cols-3 gap-4">
      <div className={priceColor}>{parseFloat(trade.price).toFixed(2)}</div>
      <div className="text-muted-foreground text-right">{getAmount(trade)}</div>
      <div className="text-muted-foreground text-right">
        {formatTime(trade.time)}
      </div>
    </div>
  );
};
