import LotListSummaryPanel from '../components/lot-list-summary-panel';
import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { LotListTable } from '../components/lot-list-table/lot-list-table';
import { useParams, useNavigate } from 'react-router-dom';
import { useLotsByPortfolioAndSymbol } from '@adg/client-graphql-data';
import IconAdd from '@mui/icons-material/Add';
import {
  Button,
  LoadingOverlay,
  RenderWhen,
  StyledTableContainer,
} from '@adg/client-components';
import { ApolloError } from '@apollo/client';
import styled from 'styled-components';

const StyledActionRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  align-items: center;
  margin-bottom: 16px;
  height: 48px;
`;

export const LotsListView: React.FC = () => {
  const navigate = useNavigate();
  const { portfolioId, symbol } = useParams<{
    portfolioId: string;
    symbol: string;
  }>();

  const {
    loading,
    error,
    data: lots,
  } = useLotsByPortfolioAndSymbol(portfolioId ?? '', symbol ?? '');

  if (!!error && !(error instanceof ApolloError)) {
    console.error('Unexpected error:', error);
  }

  const handleAddLot = () => {
    navigate(`/portfolio/${portfolioId}/holdings/${symbol}/lots/new`, {
      state: {
        portfolioId,
        symbol,
      },
    });
  };

  return (
    <StyledHeaderBodyContainer>
      <LotListSummaryPanel />
      <RenderWhen>
        <LoadingOverlay isLoading={loading} />
        <RenderWhen.If isTrue={!loading && !error}>
          <StyledTableContainer>
            <StyledActionRow>
              <Button mode={'success'} size={'md'} onClick={handleAddLot}>
                <IconAdd style={{ marginRight: '0.7rem' }} />
                Add Lot
              </Button>
            </StyledActionRow>
            <LotListTable lots={lots?.lots ?? []} />
          </StyledTableContainer>
        </RenderWhen.If>
      </RenderWhen>
    </StyledHeaderBodyContainer>
  );
};
export default LotsListView;
