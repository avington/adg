import styled from 'styled-components';

export const StyledMain = styled.main`
  display: grid;
  grid-template-columns: 5rem 1fr 5rem;
  min-height: calc(100vh - 4rem); /* Adjust 4rem to your header's height */
  > * {
    grid-column: 2;
  }
`;
