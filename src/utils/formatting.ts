export const getPriceDecimals = (bucketSize: number): number => {
  const [, decimal] = bucketSize.toString().split(".");
  return decimal ? decimal.length : 0;
};

export const formatPrice = (price: number, bucketSize: number): string => {
  return price.toFixed(getPriceDecimals(bucketSize));
};

export const formatQuantity = (quantity: number): string => {
  return quantity.toFixed(4);
};

export const formatTotal = (total: number): string => {
  return total.toFixed(2);
};
