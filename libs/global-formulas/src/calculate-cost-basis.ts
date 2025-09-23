/**
 * Calculate the cost basis for a position.
 *
 * Supports positional args (totalShares, averagePrice) or an object
 * { totalShares, averagePrice }.
 * Returns 0 when inputs are missing/invalid.
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
  let shares: number | null | undefined;
  let avg: number | null | undefined;

  if (typeof a === 'object' && a !== null) {
    shares = a.totalShares;
    avg = a.averagePrice;
  } else {
    shares = a as number | null | undefined;
    avg = b;
  }

  if (shares == null || avg == null) return 0;
  const s = Number(shares);
  const p = Number(avg);
  if (!isFinite(s) || !isFinite(p)) return 0;
  return s * p;
}
