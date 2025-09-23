/**
 * Calculate current market value for a position by multiplying total shares and latest price.
 * Falls back to 0 when inputs are missing/invalid.
 */
export function calculateMarketValue(params: {
  totalShares?: number | null | undefined;
  price?: number | null | undefined;
}): number {
  const shares = Number(params.totalShares ?? 0);
  const price = Number(params.price ?? 0);
  if (!isFinite(shares) || !isFinite(price)) return 0;
  return shares * price;
}
