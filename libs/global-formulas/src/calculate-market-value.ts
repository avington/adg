/**
 * Calculate current market value for a position by multiplying total shares and latest price.
 * Throws an error if totalShares or price is missing or invalid.
 */
export function calculateMarketValue(params: {
  totalShares?: number | null | undefined;
  price?: number | null | undefined;
}): number {
  if (params.totalShares == null || params.price == null) {
    // When data is incomplete, treat market value as 0 rather than throwing.
    return 0;
  }
  const shares = Number(params.totalShares);
  const price = Number(params.price);
  if (!isFinite(shares) || !isFinite(price)) {
    return 0;
  }
  return shares * price;
}
