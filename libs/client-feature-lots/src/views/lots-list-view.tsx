import {
  Button,
  LoadingOverlay,
  RenderWhen,
  StyledActionRow,
  StyledTableContainer,
} from '@adg/client-components';
import { useLotsByPortfolioAndSymbol } from '@adg/client-graphql-data';
import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { ApolloError } from '@apollo/client';
import IconAdd from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import LotListSummaryPanel from '../components/lot-list-summary-panel';
import { LotListTable } from '../components/lot-list-table/lot-list-table';

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
        <RenderWhen.If isTrue={loading}>
          <LoadingOverlay isLoading={loading} />
        </RenderWhen.If>
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
