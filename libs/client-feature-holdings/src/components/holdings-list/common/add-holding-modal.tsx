import {
  FormActionRow,
  Modal,
  StyledFieldset,
  StyledFieldsetLegend,
  StyledFormControl,
  StyledInput,
  useToaster,
} from '@adg/client-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PositionCreateRequestModel,
  PositionCreateSchema,
} from '@adg/global-validations';
import { useEffect } from 'react';

export interface AddHoldingModalProps {
  portfolioId?: string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: PositionCreateRequestModel) => void;
}

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  portfolioId,
  isOpen,
  onClose,
  onAdd,
}) => {
  const { register, handleSubmit, reset, setValue } =
    useForm<PositionCreateRequestModel>({
      resolver: zodResolver(PositionCreateSchema),
      defaultValues: { symbol: '', portfolioId: portfolioId },
    });

  const { showError, showSuccess } = useToaster();

  useEffect(() => {
    if (portfolioId !== undefined) {
      setValue('portfolioId', portfolioId);
    }
  }, [portfolioId, setValue]);

  return (
    <Modal title="Add Holding" onClose={onClose} isOpen={isOpen}>
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            await onAdd(data);
            showSuccess('Holding added successfully');
            onClose();
          } catch (error) {
            // Optionally, display an error message to the user here
            console.error('Failed to add holding:', error);
            showError('Failed to add holding');
          }
        })}
      >
        <StyledFieldset>
          <StyledFieldsetLegend>Enter Holding Symbol</StyledFieldsetLegend>
          <StyledFormControl>
            <label htmlFor="symbol">Holding Symbol</label>
            <StyledInput
              id="symbol"
              type="text"
              {...register('symbol', { required: true })}
            />
          </StyledFormControl>
        </StyledFieldset>
        <FormActionRow onAbort={onClose} onReset={() => reset()} />
      </form>
    </Modal>
  );
};
