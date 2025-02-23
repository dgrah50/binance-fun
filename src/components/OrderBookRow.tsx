import { memo } from "react";
import { formatPrice, formatQuantity, formatTotal } from "@/utils/formatting";
import type { BucketedOrder } from "@/types/orderbook";

interface OrderBookRowProps {
  order: BucketedOrder;
  maxTotal: number;
  bucketSize: number;
  displayMode: "base" | "quote";
  type: "ask" | "bid";
}

const getAmount = (order: BucketedOrder, displayMode: "base" | "quote") => {
  if (displayMode === "base") {
    return formatQuantity(order.quantity);
  } else {
    return formatTotal(order.total);
  }
};

const getTotal = (order: BucketedOrder, displayMode: "base" | "quote") => {
  if (displayMode === "base") {
    return formatTotal(order.total);
  } else {
    return formatQuantity(order.quantity);
  }
};

const OrderBookRow = memo(
  ({ order, maxTotal, bucketSize, displayMode, type }: OrderBookRowProps) => {
    const percentage = (order.total / maxTotal) * 100;
    const colorClass = type === "ask" ? "text-red-500" : "text-green-500";
    const bgColorClass = type === "ask" ? "bg-red-500/25" : "bg-green-500/25";

    return (
      <div className="relative">
        <div
          className={`absolute left-0 top-0 h-full ${bgColorClass}`}
          style={{ width: `${percentage}%` }}
        />
        <div className="relative z-10 grid grid-cols-3 gap-4">
          <div className={`${colorClass} font-mono`}>
            {formatPrice(order.price, bucketSize)}
          </div>
          <div className="text-right font-mono">
            {getAmount(order, displayMode)}
          </div>
          <div className="text-right font-mono">
            {getTotal(order, displayMode)}
          </div>
        </div>
      </div>
    );
  }
);

OrderBookRow.displayName = "OrderBookRow";

export default OrderBookRow;
