import { memo } from "react";
import type { BucketedOrder } from "@/types/orderbook";
import OrderBookRow from "./OrderBookRow";

interface OrderBookSectionProps {
  orders: BucketedOrder[];
  maxTotal: number;
  bucketSize: number;
  displayMode: "base" | "quote";
  type: "ask" | "bid";
  base: string;
  quote: string;
}

const OrderBookSection = memo(
  ({
    orders,
    maxTotal,
    bucketSize,
    displayMode,
    type,
    base,
    quote,
  }: OrderBookSectionProps) => {
    const sortedOrders =
      type === "ask" ? [...orders].sort((a, b) => b.price - a.price) : orders;

    return (
      <div className="grid">
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="text-muted-foreground font-medium">
            Price({quote})
          </div>
          <div className="text-muted-foreground font-medium text-right">
            Amount({displayMode === "base" ? base : quote})
          </div>
          <div className="text-muted-foreground font-medium text-right">
            Total
          </div>
        </div>
        <div className="space-y-1">
          {sortedOrders.map((order, i) => (
            <OrderBookRow
              key={`${type}-${i}-${order.price}`}
              order={order}
              maxTotal={maxTotal}
              bucketSize={bucketSize}
              displayMode={displayMode}
              type={type}
            />
          ))}
        </div>
      </div>
    );
  }
);

OrderBookSection.displayName = "OrderBookSection";

export default OrderBookSection;
