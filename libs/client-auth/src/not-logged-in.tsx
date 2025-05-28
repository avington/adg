import styled from 'styled-components';
import AuthenticationStatusButton from './authentication-status-button/authentication-status-button';

const StyledMain = styled.main`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: var(--color-grey-50);
`;

export const NotLoggedIn = () => {
  return (
    <StyledMain>
      <div>Please log in to access the application.</div>
      <div>
        <AuthenticationStatusButton />
      </div>
    </StyledMain>
  );
};
