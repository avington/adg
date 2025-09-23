import {
  HeadingContainer,
  LoadingOverlay,
  useToaster,
} from '@adg/client-components';
import {
  useAllPortfolios,
  useHoldingsOverview,
} from '@adg/client-graphql-data';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledLotListSummaryPanel = styled.section`
  display: grid;
  grid-template-areas:
    'name . . symbol'
    'totalShares averagePrice realizedGains unrealizedGains';
  width: 100%;
  border-bottom: 0.5rem solid var(--color-divider);
  margin-bottom: 1rem;
`;

export const LotListSummaryPanel: React.FC = () => {
  const { symbol, portfolioId } = useParams();

  // get portfolio
  const {
    data: portfoliosData,
    loading: portfoliosLoading,
    error: portfoliosError,
  } = useAllPortfolios();
  const portfolio = (portfoliosData?.portfolios ?? []).find(
    (p) => p.id === portfolioId
  );
  const portfolioName = portfolio?.name ?? 'Portfolio';

  // get position overview
  const {
    data: holdingsOverviewData,
    loading: holdingsOverviewLoading,
    error: holdingsOverviewError,
  } = useHoldingsOverview(portfolioId ?? '');

  const { showError } = useToaster();

  useEffect(() => {
    if (portfoliosError) {
      showError('Failed to load portfolios.');
    }
    if (holdingsOverviewError) {
      showError('Failed to load holdings overview.');
    }
  }, [portfoliosError, holdingsOverviewError, showError]);

  const holding = holdingsOverviewData?.positionOverviews.find(
    (h) => h.symbol === symbol
  );

  return (
    <div>
      <LoadingOverlay
        isLoading={portfoliosLoading || holdingsOverviewLoading}
      />
      <StyledLotListSummaryPanel>
        <div style={{ gridArea: 'name' }}>{portfolioName}</div>
        <div style={{ gridArea: 'symbol' }}>{symbol}</div>
        <HeadingContainer
          gridArea="totalShares"
          label="Total Shares"
          value={holding?.lots?.totalShares ?? 0}
        />
        <HeadingContainer
          gridArea="averagePrice"
          label="$ Cost Average"
          value={holding?.lots?.averagePrice ?? 0}
          showDollar
        />
        <HeadingContainer
          gridArea="realizedGains"
          label="Realized Gains"
          value={holding?.lots?.realizedGains ?? 0}
          showDollar
        />
        <HeadingContainer
          gridArea="unrealizedGains"
          label="Unrealized Gains"
          value={holding?.lots?.unrealizedGains ?? 0}
          showDollar
        />
      </StyledLotListSummaryPanel>
    </div>
  );
};
export default LotListSummaryPanel;
