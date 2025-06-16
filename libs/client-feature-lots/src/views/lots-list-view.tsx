import LotListSummaryPanel from '../components/lot-list-summary-panel';
import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { LotListTable } from '../components/lot-list-table.tsx/lot-list-table';

export const LotsListView: React.FC = () => {
  return (
    <StyledHeaderBodyContainer>
      <LotListSummaryPanel />
      <LotListTable />
    </StyledHeaderBodyContainer>
  );
};
export default LotsListView;
