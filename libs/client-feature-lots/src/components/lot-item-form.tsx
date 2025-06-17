import { StyledDateInput } from '@adg/client-components';
import { LotModel } from '@adg/global-validations';
import { useForm, SubmitHandler } from 'react-hook-form';

export const LotItemForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LotModel>();
  const onSubmit: SubmitHandler<LotModel> = (data) => {
    // Handle form submission logic here
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="openDate">Open Date</label>
        <StyledDateInput
          id="openDate"
          placeholder="YYYY-MM-DD"
          {...register('openDate', {
            required: 'Open date is required',
            validate: (value) => {
              const date = new Date(value);
              return !isNaN(date.getTime()) || 'Invalid date';
            },
          })}
        />
        {errors.openDate && <span>{errors.openDate.message}</span>}
      </div>
    </form>
  );
};

export default LotItemForm;
