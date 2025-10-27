export const FeeConfig = {
  PERCENTAGE: 0.08, // 8% base fee
  FIXED: 0.5, // $0.50 fixed fee
  TAX_RATE: 0.15, // 15% tax on fees
} as const;

export interface FeeBreakdown {
  baseFee: number;
  tax: number;
  total: number;
}

/**
 * Calculate the fees for a given price
 * @param price - The ticket price to calculate fees for
 * @returns The total fees (base fee + tax)
 */
export function calculateFees(price: number): number {
  if (price === 0) return 0;

  const baseFee = price * FeeConfig.PERCENTAGE + FeeConfig.FIXED;
  const tax = baseFee * FeeConfig.TAX_RATE;
  const total = baseFee + tax;

  return parseFloat(total.toFixed(2));
}

/**
 * Get detailed fee breakdown for transparency
 * @param price - The ticket price to calculate fees for
 * @returns Detailed breakdown of fee calculation
 */
export function getFeeBreakdown(price: number): FeeBreakdown {
  if (price === 0) {
    return { baseFee: 0, tax: 0, total: 0 };
  }

  const baseFee = parseFloat(
    (price * FeeConfig.PERCENTAGE + FeeConfig.FIXED).toFixed(2)
  );
  const tax = parseFloat((baseFee * FeeConfig.TAX_RATE).toFixed(2));
  const total = parseFloat((baseFee + tax).toFixed(2));

  return { baseFee, tax, total };
}

/**
 * Calculate total order amount including fees
 * @param subtotal - Order subtotal before fees
 * @returns Total amount including fees
 */
export function calculateOrderTotal(subtotal: number): number {
  const fees = calculateFees(subtotal);
  return parseFloat((subtotal + fees).toFixed(2));
}
