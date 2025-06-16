import styled from 'styled-components';

export const StyledHeaderBodyContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: calc(100vh - 4rem); /* Adjust 4rem to your header's height */
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--color-grey-50);
  background-image: linear-gradient(
    to bottom,
    var(--color-grey-50),
    var(--color-grey-100)
  );
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
`;
