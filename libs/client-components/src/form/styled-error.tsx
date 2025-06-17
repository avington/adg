import styled from 'styled-components';

export const StyledError = styled.div`
  color: var(--color-red-600);
  font-size: 0.875rem; /* 14px */
  margin-top: 0.25rem; /* 4px */
  margin-bottom: 0.5rem; /* 8px */
  line-height: 1.25; /* 20px */
`;
export const StyledErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem; /* 16px */

  ${StyledError} {
    margin-top: 0.25rem; /* 4px */
    margin-bottom: 0; /* Reset bottom margin */
  }
`;
