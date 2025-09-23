/**
 * Calculate current market value for a position by multiplying total shares and latest price.
 * Falls back to 0 when inputs are missing/invalid.
 */
export function calculateMarketValue(params: {
  totalShares?: number | null | undefined;
  price?: number | null | undefined;
}): number {
  if (params.totalShares == null || params.price == null) {
    throw new Error('Both totalShares and price must be provided.');
  }
  const shares = Number(params.totalShares);
  const price = Number(params.price);
  if (!isFinite(shares) || !isFinite(price)) {
    throw new Error('Both totalShares and price must be valid finite numbers.');
  }
  return shares * price;
}
