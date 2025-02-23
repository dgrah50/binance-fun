export const TradeHeader = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-muted-foreground font-medium">Price</div>
      <div className="text-muted-foreground font-medium text-right">Amount</div>
      <div className="text-muted-foreground font-medium text-right">Time</div>
    </div>
  );
};
