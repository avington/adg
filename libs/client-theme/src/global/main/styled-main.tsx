import styled from 'styled-components';

export const StyledMain = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  min-height: calc(100vh - 4rem); /* Adjust 4rem to your header's height */
  > * {
    grid-column: 2;
  }
`;

export const StyledInnerMain = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: var(--color-grey-50);
`;
