/* eslint-disable react-hooks/exhaustive-deps */
import {
  LoadingOverlay,
  RenderWhen,
  StyledTableContainer,
  useToaster,
} from '@adg/client-components';
import { HoldingsListActionRow } from '../common/holdings-list-action-row';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useMutateAddHolding } from '@adg/client-data';
import { useBoolean } from '@adg/client-hooks';
import { AddHoldingModal } from '../common/add-holding-modal';
import { PositionCreateRequestModel } from '@adg/global-validations';

export const HoldingsOverviewContainer: React.FC = () => {
  const { addHolding, loading, errorMessage } = useMutateAddHolding();
  const { setFalse, setTrue, value: open } = useBoolean(false);
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const { showError } = useToaster();

  const handleAddHoldingModalOpen = useCallback(() => {
    setTrue();
  }, [setTrue]);

  const handleAddHolding = useCallback(
    async ({ symbol }: PositionCreateRequestModel) => {
      if (!portfolioId) {
        // Optionally show an error or handle this case
        showError('Portfolio ID is missing.');
        return;
      }
      await addHolding({
        symbol,
        portfolioId,
      });
    },
    [addHolding, portfolioId, showError]
  );

  useEffect(() => {
    if (errorMessage) {
      showError(errorMessage);
      setFalse();
    }
  }, [errorMessage]);

  return (
    <>
      <StyledTableContainer>
        <LoadingOverlay isLoading={loading} />
        <HoldingsListActionRow onAddHolding={handleAddHoldingModalOpen} />
        <div>table</div>
      </StyledTableContainer>
      <RenderWhen>
        <RenderWhen.If isTrue={open}>
          <AddHoldingModal
            portfolioId={portfolioId}
            isOpen={open}
            onClose={setFalse}
            onAdd={handleAddHolding}
          />
        </RenderWhen.If>
      </RenderWhen>
    </>
  );
};
