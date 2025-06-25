import {
  Button,
  StyledActionRow,
  StyledTableContainer,
  useToaster,
  RenderWhen,
  LoadingOverlay,
} from '@adg/client-components';
import IconAdd from '@mui/icons-material/Add';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllPortfolios } from '@adg/client-graphql-data';
import { PortfolioProjection } from '@adg/server-domain-read-models';
import PortfolioListTable from './portfolio-list-table';

export const PortfolioListContainer: React.FC = () => {
  const toaster = useToaster();
  const navigate = useNavigate();

  const { loading, error, data: portfolioData } = useAllPortfolios();

  const handleAddPortfolio = useCallback(() => {
    // Navigate to the new portfolio creation page
    navigate('/portfolio/new', {
      state: {
        // You can pass any additional state if needed
      },
    });
  }, [navigate]);

  return (
    <StyledTableContainer>
      <StyledActionRow>
        <Button mode={'success'} size={'md'} onClick={handleAddPortfolio}>
          <IconAdd style={{ marginRight: '0.7rem' }} />
          Add Portfolio
        </Button>
      </StyledActionRow>
      <RenderWhen>
        <RenderWhen.If isTrue={loading}>
          <LoadingOverlay isLoading={loading} />
        </RenderWhen.If>
        <RenderWhen.If isTrue={!!error}>
          <div style={{ color: 'red', padding: '1rem' }}>
            Failed to load portfolios. Please try again later.
          </div>
        </RenderWhen.If>
        <RenderWhen.If isTrue={!loading && !error}>
          <PortfolioListTable
            portfolios={portfolioData?.portfolios}
            onDelete={(item) => console.log('delete', item)}
            onEdit={(item) => console.log('edit', item)}
          />
        </RenderWhen.If>
      </RenderWhen>
    </StyledTableContainer>
  );
};
