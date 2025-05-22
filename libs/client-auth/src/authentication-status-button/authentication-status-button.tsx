import styled from 'styled-components';
import { GoogleLogin, useGoogleOAuth } from '@react-oauth/google';
import { useAuthentication } from '../use-authentication';
import { RenderWhen } from '@adg/client-components';

const StyledAuthenticationStatusButton = styled.div`
  color: pink;
`;
export function AuthenticationStatusButton() {
  const { isLoggedIn, onLoginSuccess } = useAuthentication();
  return (
    <StyledAuthenticationStatusButton>
      <RenderWhen>
        <RenderWhen.If isTrue={!isLoggedIn}>
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </RenderWhen.If>
        <RenderWhen.If isTrue={isLoggedIn}>
          <div>Logged In</div>
        </RenderWhen.If>
      </RenderWhen>
    </StyledAuthenticationStatusButton>
  );
}

export default AuthenticationStatusButton;
