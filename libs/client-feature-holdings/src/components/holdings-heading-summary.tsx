import { HeadingContainer } from '@adg/client-components';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@adg/client-state';
import {
  selectPortfolioCostBasis,
  selectPortfolioMarketValue,
  selectPortfolioTotalGains,
  selectPortfolioDailyChange,
} from '@adg/client-state';
import { StyledHoldingsHeadingSummary } from './styled-holdings-heading-summary';

export const HoldingsHeadingSummary: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();

  // Derived totals from selectors
  const costBasis = useAppSelector(
    portfolioId ? selectPortfolioCostBasis(portfolioId) : () => 0
  );
  const marketValue = useAppSelector(
    portfolioId ? selectPortfolioMarketValue(portfolioId) : () => 0
  );
  const totalGains = useAppSelector(
    portfolioId ? selectPortfolioTotalGains(portfolioId) : () => 0
  );
  const dailyChangeSum = useAppSelector(
    portfolioId ? selectPortfolioDailyChange(portfolioId) : () => 0
  );
  const previousValue = marketValue - dailyChangeSum;
  const dailyPct =
    previousValue > 0 ? (dailyChangeSum / previousValue) * 100 : 0;

  return (
    <StyledHoldingsHeadingSummary>
      <HeadingContainer
        label="Portfolio Value"
        value={marketValue}
        showDollar={true}
      />
      <HeadingContainer label="Cost" value={costBasis} showDollar={true} />
      <HeadingContainer
        label="Total Gains"
        value={totalGains}
        percentage={costBasis > 0 ? (totalGains / costBasis) * 100 : 0}
        showDollar={true}
        colorize={true}
      />
      <HeadingContainer
        label="Daily Gains"
        value={dailyChangeSum}
        percentage={dailyPct}
        showDollar={true}
        colorize={true}
      />
    </StyledHoldingsHeadingSummary>
  );
};
