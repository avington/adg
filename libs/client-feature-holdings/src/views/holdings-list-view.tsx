import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { useParams } from 'react-router-dom';
import HoldingBreadcrumbs from '../components/holding-breadcrumbs';
import { HoldingsHeadingSummary } from '../components/holdings-heading-summary';

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
      <div>
        {/* Example placeholder: */}
        <span>Holdings table will be displayed here.</span>
      </div>
    </StyledHeaderBodyContainer>
  );
};

export default HoldingsListView;
