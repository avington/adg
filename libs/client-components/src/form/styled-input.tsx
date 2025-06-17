import styled from 'styled-components';

export const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-blue-grey-200);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-blue-grey-900);
  background-color: var(--color-white);

  &:focus {
    border-color: var(--color-blue-500);
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.2);
  }

  &::placeholder {
    color: var(--color-blue-grey-400);
    opacity: 1; /* Ensures placeholder is fully opaque */
  }
`;
