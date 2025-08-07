/**
 * Calculate the price based on bid and ask values.
 * If both bid and ask are present, return their average.
 * If only one is present, return that value.
 * If neither is present, return 0.
 *
 * @param bid - The bid price
 * @param ask - The ask price
 * @returns The calculated price
 */
export const calculatedPrice = (bid: number, ask: number) => {
  if (bid != null && ask != null) {
    return (bid + ask) / 2;
  }
  return bid || ask || 0;
};
