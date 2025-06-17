import styled from 'styled-components';
import { Button } from '../buttons/button';

export const StyledFormActionRow = styled.div`
  display: flex;
  justify-content: end;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-blue-grey-200);
`;

export const FormActionRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  onReset,
  onAbort,
  onSubmit,
}) => {
  return (
    <StyledFormActionRow>
      <Button mode="outlined" type="reset" onClick={onReset}>
        Reset
      </Button>
      <Button mode="secondary" type="button" onClick={onAbort}>
        Cancel
      </Button>
      <Button mode="primary" type="submit">
        Submit
      </Button>
    </StyledFormActionRow>
  );
};
