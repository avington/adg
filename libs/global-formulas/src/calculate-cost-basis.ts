/**
 * Calculate the cost basis for a position.
 *
 * Supports either positional arguments (totalShares, averagePrice)
 * or a single object argument: { totalShares, averagePrice }.
 *
 * If inputs are missing or not finite numbers, returns 0.
 */
export function calculateCostBasis(
  totalShares?: number | null,
  averagePrice?: number | null
): number;

export function calculateCostBasis(params: {
  totalShares?: number | null | undefined;
  averagePrice?: number | null | undefined;
}): number;

export function calculateCostBasis(
  a?:
    | number
    | null
    | { totalShares?: number | null; averagePrice?: number | null },
  b?: number | null
): number {
  let totalShares: number | null | undefined;
  let averagePrice: number | null | undefined;

  if (typeof a === 'object' && a !== null) {
    totalShares = a.totalShares;
    averagePrice = a.averagePrice;
  } else {
    totalShares = a as number | null | undefined;
    averagePrice = b;
  }

  if (totalShares == null || averagePrice == null) return 0;

  const sharesNum = Number(totalShares);
  const avgNum = Number(averagePrice);
  if (!isFinite(sharesNum) || !isFinite(avgNum)) return 0;

  return sharesNum * avgNum;
}
