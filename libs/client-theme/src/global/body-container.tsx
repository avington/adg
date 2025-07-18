import styled from 'styled-components';
import GlobalResetStyle from './reset';
import GlobalColors from './colors';
import { GlobalThemeContextProvider } from './context/global-theme-context-provider';
import { DefaultHeader } from './header/default-header';
import { StyledInnerMain, StyledMain } from './main/styled-main';

export const BodyContainerStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  width: 100%;
  overflow: hidden;
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
  box-shadow: 0 0 0 100vmax var(--color-grey-50);
  border-radius: 0;
`;
export const BodyContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalThemeContextProvider>
      <BodyContainerStyles>
        <GlobalResetStyle />
        <GlobalColors />
        <DefaultHeader />
        <StyledMain>
          <StyledInnerMain>{children}</StyledInnerMain>
        </StyledMain>
      </BodyContainerStyles>
    </GlobalThemeContextProvider>
  );
};
