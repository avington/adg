import { LotModel, TransactionType } from '@adg/global-validations';
import { PositionLotsModel } from '@adg/global-models';

/**
 * Calculate the dollar cost average of a list of lots and return position summary.
 * Handles realized gains calculation for sell transactions.
 * @param lots The list of lots to calculate the average for.
 * @param portfolioId The portfolio ID for this position.
 * @param positionId The position ID for this position.
 * @returns PositionLotsModel with averagePrice, totalShares, and realizedGains.
 */
export const calculateDollarCostAvg = (
  lots: LotModel[],
  portfolioId: string,
  positionId: string
): PositionLotsModel => {
  let totalShares = 0;
  let totalCost = 0;
  let realizedGains = 0;
  let runningAveragePrice = 0;

  // Sort lots by openDate to process them chronologically
  const sortedLots = [...lots].sort(
    (a, b) => new Date(a.openDate).getTime() - new Date(b.openDate).getTime()
  );

  for (const lot of sortedLots) {
    const lotPrice = lot.price ?? 0;

    if (lot.transactionType === 'BUY') {
      // Add to position
      totalCost += lotPrice * lot.shares;
      totalShares += lot.shares;

      // Recalculate average price
      runningAveragePrice = totalShares > 0 ? totalCost / totalShares : 0;
    } else if (lot.transactionType === 'SELL') {
      // Calculate realized gains for this sell transaction
      const sellValue = lotPrice * lot.shares;
      const costBasis = runningAveragePrice * lot.shares;
      realizedGains += sellValue - costBasis;

      // Remove from position at average cost
      totalCost -= costBasis;
      totalShares -= lot.shares;

      // Ensure we don't go negative due to rounding errors
      if (totalShares <= 0) {
        totalShares = 0;
        totalCost = 0;
        runningAveragePrice = 0;
      } else {
        runningAveragePrice = totalCost / totalShares;
      }
    }
  }

  // Final average price calculation
  const averagePrice = totalShares > 0 ? totalCost / totalShares : 0;

  return {
    portfolioId,
    positionId,
    totalShares,
    averagePrice,
    realizedGains,
  };
};
