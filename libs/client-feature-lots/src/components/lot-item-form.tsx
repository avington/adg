import {
  FormActionRow,
  StyledDateInput,
  StyledDropdown,
  StyledError,
  StyledFieldset,
  StyledFieldsetLegend,
  StyledFormControl,
  StyledInput,
} from '@adg/client-components';
import { LotModel, LotValidationSchema } from '@adg/global-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export interface LotItemFormProps {
  onSubmitClicked: (data: LotModel) => void;
  onCancelClicked: () => void;
}

export const LotItemForm: React.FC<LotItemFormProps> = ({
  onSubmitClicked,
  onCancelClicked,
}) => {
  const { portfolioId, symbol } = useParams();

  const defaultValues: LotModel = {
    lotId: '',
    symbol: symbol || '',
    portfolioId: portfolioId || '',
    userId: '',
    transactionType: 'BUY',
    shares: 0,
    price: 0,
    openDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdatedBy: '',
    costBasis: 0,
    marketValue: 0,
    holdingPeriod: 'SHORT_TERM',
    gainsLosses: 0,
    gainsLossesPercentage: 0,
  };

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<LotModel>({
    mode: 'onBlur',
    resolver: zodResolver(LotValidationSchema),
    defaultValues: defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmitClicked)}>
      <StyledFieldset>
        <StyledFieldsetLegend>Lot Item Form</StyledFieldsetLegend>
        <StyledFormControl>
          <label htmlFor="openDate">Open Date</label>
          <StyledDateInput
            id="openDate"
            placeholder="YYYY-MM-DD"
            style={{ width: '20rem' }}
            {...register('openDate', {
              setValueAs: (value) => (value ? new Date(value) : undefined),
            })}
          />
          {errors.openDate && (
            <StyledError>{errors.openDate.message}</StyledError>
          )}
        </StyledFormControl>
        <StyledFormControl>
          <label htmlFor="transactionType">Transaction Type</label>
          <StyledDropdown
            id="transactionType"
            {...register('transactionType')}
            style={{ width: '10rem' }}
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </StyledDropdown>
        </StyledFormControl>
        <StyledFormControl>
          <label htmlFor="shares">Shares</label>
          <StyledInput
            id="shares"
            type="number"
            placeholder="Enter shares"
            {...register('shares', {
              setValueAs: (value) => (value ? Number(value) : undefined),
            })}
            style={{ width: '10rem' }}
          />
          {errors.shares && <StyledError>{errors.shares.message}</StyledError>}
        </StyledFormControl>
        <StyledFormControl>
          <label htmlFor="price">Price</label>
          <StyledInput
            id="price"
            type="number"
            placeholder="Enter price"
            {...register('price', {
              setValueAs: (value) => (value ? Number(value) : undefined),
            })}
            style={{ width: '10rem' }}
          />
          {errors.price && <StyledError>{errors.price.message}</StyledError>}
        </StyledFormControl>
        <FormActionRow onAbort={onCancelClicked} onReset={() => reset()} />
        {errors.root && <StyledError>{errors.root.message}</StyledError>}
      </StyledFieldset>
    </form>
  );
};

export default LotItemForm;
