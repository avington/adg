/**
 * Minimal short-quote shape suitable for attaching live pricing to UI projections.
 * Intentionally mirrors fields used by the client without introducing cross-lib deps.
 */
export interface LatestQuote {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

/**
 * Utility type: augment any base type (that at least has a symbol) with an optional latestQuote.
 * Example: WithLatestQuote<PositionOverviewProjection>
 */
export type WithLatestQuote<TBase extends { symbol: string }> = TBase & {
  latestQuote?: LatestQuote;
};
