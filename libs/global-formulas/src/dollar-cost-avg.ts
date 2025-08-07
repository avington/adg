import { LotProjection } from '@adg/global-read-models';

/**
 * Calculate the dollar cost average of a list of lots.
 * @param lots The list of lots to calculate the average for.
 * @returns The dollar cost average and total shares.
 */
export const calculateDollarCostAvg = (lots: LotProjection[]) => {
  const totalShares = lots.reduce((acc, lot) => acc + lot.shares, 0);
  const totalCost = lots.reduce(
    (acc, lot) => acc + (lot.price ?? 0) * lot.shares,
    0
  );
  const averagePrice = totalShares ? totalCost / totalShares : 0;
  return { averagePrice, totalShares };
};
