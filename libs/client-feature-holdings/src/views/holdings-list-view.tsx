import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { useParams } from 'react-router-dom';
import HoldingBreadcrumbs from '../components/holding-breadcrumbs';

export const HoldingsListView: React.FC = () => {
  const { portfolioId } = useParams<{
    portfolioId: string;
  }>();
  return (
    <StyledHeaderBodyContainer>
      <div>
        <HoldingBreadcrumbs />
      </div>
      <div>table</div>
    </StyledHeaderBodyContainer>
  );
};

export default HoldingsListView;
