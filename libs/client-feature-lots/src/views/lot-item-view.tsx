import { StyledHeaderBodyContainer } from '@adg/client-theme';
import LotListSummaryPanel from '../components/lot-list-summary-panel';
import LotItemForm from '../components/lot-item-form';

export const LotItemView: React.FC = () => {
  return (
    <StyledHeaderBodyContainer>
      <LotListSummaryPanel />
      <LotItemForm />
    </StyledHeaderBodyContainer>
  );
};
export default LotItemView;
