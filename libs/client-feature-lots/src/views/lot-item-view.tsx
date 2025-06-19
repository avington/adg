import { useSaveLot } from '@adg/client-data';
import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { LotModel } from '@adg/global-validations';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LotItemForm from '../components/lot-item-form';
import LotListSummaryPanel from '../components/lot-list-summary-panel';
import { LoadingOverlay } from '@adg/client-components';

export const LotItemView: React.FC = () => {
  const { portfolioId, symbol, lotId } = useParams<{
    portfolioId: string;
    symbol: string;
    lotId: string;
  }>();

  const { saveLot, loading, error } = useSaveLot();

  const navigate = useNavigate();
  const handleSubmit = useCallback(
    (data: LotModel) => {
      console.log('Form submitted with data:', data);
      // Handle form submission logic here
      saveLot(data, () => {
        navigate(`/portfolio/${portfolioId}/holdings/${symbol}/lots`);
      });
    },
    [navigate, portfolioId, saveLot, symbol]
  );

  const handleCancel = useCallback(() => {
    navigate(`/portfolio/${portfolioId}/holdings/${symbol}/lots`);
  }, [navigate, portfolioId, symbol]);

  return (
    <StyledHeaderBodyContainer>
      <LoadingOverlay isLoading={loading} />
      <LotListSummaryPanel />

      <LotItemForm
        onSubmitClicked={handleSubmit}
        onCancelClicked={handleCancel}
      />
    </StyledHeaderBodyContainer>
  );
};
export default LotItemView;
