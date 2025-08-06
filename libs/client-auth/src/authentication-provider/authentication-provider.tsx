import { RenderWhen } from '@adg/client-components';
import { useUserStore } from '@adg/client-state';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PropsWithChildren } from 'react';
import { NotLoggedIn } from '../not-logged-in';

export interface AuthenticationProviderProps {
  clientId: string;
}

export const AuthenticationProvider: React.FC<
  PropsWithChildren<AuthenticationProviderProps>
> = ({ clientId, children }) => {
  const isLoggedIn = useUserStore.use.isLoggedIn();
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <RenderWhen>
        <RenderWhen.If isTrue={!isLoggedIn}>
          <NotLoggedIn />
        </RenderWhen.If>
        <RenderWhen.If isTrue={isLoggedIn}>{children}</RenderWhen.If>
      </RenderWhen>
    </GoogleOAuthProvider>
  );
};

export default AuthenticationProvider;
