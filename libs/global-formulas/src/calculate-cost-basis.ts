/**
 * Calculate the cost basis (total cost) of a position.
 *
 * Supports two calling styles:
 * 1. Object: calculateCostBasis({ totalShares, averagePrice })
 * 2. Positional (legacy): calculateCostBasis(totalShares, averagePrice)
 *
 * Any missing / non-finite inputs result in 0 to keep UI resilient.
 */
export function calculateCostBasis(params: {
  totalShares?: number | null | undefined;
  averagePrice?: number | null | undefined;
}): number;
export function calculateCostBasis(
  totalShares?: number | null | undefined,
  averagePrice?: number | null | undefined
): number;
export function calculateCostBasis(
  arg1?:
    | number
    | null
    | undefined
    | {
        totalShares?: number | null | undefined;
        averagePrice?: number | null | undefined;
      },
  arg2?: number | null | undefined
): number {
  let totalShares: number | null | undefined;
  let averagePrice: number | null | undefined;

  if (typeof arg1 === 'object' && arg1 !== null && !Array.isArray(arg1)) {
    // Object style
    totalShares = arg1.totalShares;
    averagePrice = arg1.averagePrice;
  } else {
    // Positional style
    totalShares = arg1 as number | null | undefined;
    averagePrice = arg2;
  }

  if (
    totalShares === null ||
    totalShares === undefined ||
    averagePrice === null ||
    averagePrice === undefined
  ) {
    return 0;
  }

  const sharesNum = Number(totalShares);
  const avgNum = Number(averagePrice);
  if (!isFinite(sharesNum) || !isFinite(avgNum)) return 0;
  return sharesNum * avgNum;
}

/**
 * Explicit helper for positional usage retained for clarity.
 */
export function calculateCostBasisFromValues(
  totalShares?: number | null,
  averagePrice?: number | null
): number {
  return calculateCostBasis(totalShares, averagePrice);
}
