import { GoogleOAuthProvider } from '@react-oauth/google';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export interface AuthenticationProviderProps {
  clientId: string;
}

export const AuthenticationProvider: React.FC<
  PropsWithChildren<AuthenticationProviderProps>
> = ({ clientId, children }) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};

export default AuthenticationProvider;
