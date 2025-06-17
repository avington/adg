import LotListSummaryPanel from '../components/lot-list-summary-panel';
import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { LotListTable } from '../components/lot-list-table/lot-list-table';
import { useParams, useNavigate } from 'react-router-dom';
import { useLotsByPortfolioAndSymbol } from '@adg/client-graphql-data';
import {
  Button,
  LoadingOverlay,
  RenderWhen,
  StyledTableContainer,
} from '@adg/client-components';
import { ApolloError } from '@apollo/client';
import styled from 'styled-components';
import { IconPlus } from '@tabler/icons-react';

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
        <RenderWhen.If isTrue={loading}>
          <LoadingOverlay />
        </RenderWhen.If>
        <RenderWhen.If isTrue={!loading && !error}>
          <StyledTableContainer>
            <StyledActionRow>
              <Button mode={'success'} size={'md'} onClick={handleAddLot}>
                <IconPlus />
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
