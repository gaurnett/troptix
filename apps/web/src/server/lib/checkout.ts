//TODO: Need to centralize the fee calculation and fee percentage
/**
 * Calculate the fees for a given price
 * @param price - The price to calculate the fees for
 * @returns The fees for the given price
 */
export function calculateFees(price: number) {
  if (price === 0) return 0;
  const fee = price * 0.04 + 0.3;
  const tax = fee * 0.15;
  return parseFloat((fee + tax).toFixed(2));
}
