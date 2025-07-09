import {
  FormActionRow,
  StyledError,
  StyledFieldset,
  StyledFieldsetLegend,
  StyledFormControl,
  StyledInput,
  StyledTextarea,
} from '@adg/client-components';
import {
  PortfolioCreateModel,
  PortfolioCreateSchema,
} from '@adg/global-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface PortfolioModalFormProps {
  portfolio: PortfolioCreateModel;
  onSave: SubmitHandler<PortfolioCreateModel>;
  onCancel?: () => void;
}

export const PortfolioModalForm: React.FC<PortfolioModalFormProps> = ({
  portfolio,
  onSave,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioCreateModel>({
    mode: 'onBlur',
    resolver: zodResolver(PortfolioCreateSchema),
    defaultValues: {
      ...portfolio,
      isActive: portfolio.isActive ?? true, // Provide fallback for optional
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <StyledFieldset>
        <StyledFieldsetLegend>Portfolio Form</StyledFieldsetLegend>
        <StyledFormControl>
          <label htmlFor="name">Name</label>
          <StyledInput
            id="name"
            type="text"
            {...register('name')}
            placeholder="Enter portfolio name"
          />
          {errors.name && <StyledError>{errors.name.message}</StyledError>}
        </StyledFormControl>
        <StyledFormControl>
          <label htmlFor="description">Description</label>
          <StyledTextarea
            id="description"
            {...register('description')}
            rows={3}
            placeholder="Enter portfolio description"
          />
          {errors.description && (
            <StyledError>{errors.description.message}</StyledError>
          )}
        </StyledFormControl>
        <FormActionRow onAbort={onCancel} onReset={() => reset()} />
        {errors.root && <StyledError>{errors.root.message}</StyledError>}
      </StyledFieldset>
    </form>
  );
};
