import { useSaveLot } from '@adg/client-data';
import { StyledHeaderBodyContainer } from '@adg/client-theme';
import { LotModel } from '@adg/global-validations';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LotItemForm from '../components/lot-item-form';
import LotListSummaryPanel from '../components/lot-list-summary-panel';
import { LoadingOverlay, useToaster } from '@adg/client-components';

export const LotItemView: React.FC = () => {
  const { portfolioId, symbol } = useParams<{
    portfolioId: string;
    symbol: string;
    lotId: string;
  }>();

  const { showSuccess } = useToaster();
  const { saveLot, loading } = useSaveLot();

  const navigate = useNavigate();
  const handleSubmit = useCallback(
    (data: LotModel) => {
      console.log('Form submitted with data:', data);
      // Handle form submission logic here
      saveLot(data, () => {
        showSuccess('Lot created successfully');
        navigate(`/portfolio/${portfolioId}/holdings/${symbol}/lots`);
      });
    },
    [navigate, portfolioId, saveLot, symbol, showSuccess]
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
