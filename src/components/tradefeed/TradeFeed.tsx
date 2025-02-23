"use client";

import { Card } from "@/components/ui/card";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { useTrades } from "@/hooks/useTrades";
import { TradeHeader } from "./TradeHeader";
import { TradeRow } from "./TradeRow";

const TradeFeed = () => {
  const {
    trades,
    displayMode,
    setDisplayMode,
    getAmount,
    formatTime,
    base,
    quote,
  } = useTrades();

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Trades</h2>
        <CurrencyToggle
          mode={displayMode}
          onModeChange={setDisplayMode}
          base={base}
          quote={quote}
        />
      </div>
      <div className="grid">
        <TradeHeader />
        {trades.map((trade) => (
          <TradeRow
            key={trade.id}
            trade={trade}
            getAmount={getAmount}
            formatTime={formatTime}
          />
        ))}
      </div>
    </Card>
  );
};

export default TradeFeed;
