import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { useParams } from 'react-router-dom';
import HoldingBreadcrumbs from '../components/holding-breadcrumbs';
import { HoldingsHeadingSummary } from '../components/holdings-heading-summary';
import { HoldingsListContainer } from '../components/holdings-list/holdings-list-container';
import { StyledHoldingsListContainer } from '../components/holdings-list/styled-holdings-list-container';

export const HoldingsListView: React.FC = () => {
  const { portfolioId } = useParams<{
    portfolioId: string;
  }>();
  return (
    <StyledHeaderBodyContainer>
      <div>
        <HoldingBreadcrumbs />
        <HoldingsHeadingSummary />
      </div>
      {/* TODO: Replace with actual holdings table */}
      <StyledHoldingsListContainer>
        <HoldingsListContainer />
      </StyledHoldingsListContainer>
    </StyledHeaderBodyContainer>
  );
};

export default HoldingsListView;
