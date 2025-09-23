/**
 * Calculate the cost basis for a position.
 *
 * Supports either positional arguments (totalShares, averagePrice)
 * or a single object argument: { totalShares, averagePrice }.
 *
 * If inputs are missing or not finite numbers, returns 0.
 */
export function calculateCostBasis(params: {
  totalShares?: number | null | undefined;
  averagePrice?: number | null | undefined;
}): number {
  const { totalShares, averagePrice } = params;
  if (totalShares == null || averagePrice == null) return 0;
  const sharesNum = Number(totalShares);
  const avgNum = Number(averagePrice);
  if (!isFinite(sharesNum) || !isFinite(avgNum)) return 0;
  return sharesNum * avgNum;
}

/**
 * Calculate the cost basis for a position using positional arguments.
 *
 * If inputs are missing or not finite numbers, returns 0.
 */
export function calculateCostBasisFromValues(
  totalShares?: number | null,
  averagePrice?: number | null
): number {
  return calculateCostBasis({ totalShares, averagePrice });
}
