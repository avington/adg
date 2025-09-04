import { StyledHeaderBodyContainer } from '@adg/client-theme';
import HoldingBreadcrumbs from '../components/holding-breadcrumbs';
import { HoldingsHeadingSummary } from '../components/holdings-heading-summary';
import { HoldingsListContainer } from '../components/holdings-list/holdings-list-container';
import { StyledHoldingsListContainer } from '../components/holdings-list/styled-holdings-list-container';

export const HoldingsListView: React.FC = () => {
  return (
    <StyledHeaderBodyContainer>
      <div>
        <HoldingBreadcrumbs />
        <HoldingsHeadingSummary />
      </div>

      <StyledHoldingsListContainer>
        <HoldingsListContainer />
      </StyledHoldingsListContainer>
    </StyledHeaderBodyContainer>
  );
};

export default HoldingsListView;
