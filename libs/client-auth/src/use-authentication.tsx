import { CredentialResponse } from '@react-oauth/google';
import { useSessionStorage } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { useCredentialStore } from '@adg/client-state';

export const useAuthentication = () => {
  const { credentials, isLoggedIn, setCredentials } = useCredentialStore();
  const [storedCredentials, setStoredCredentials] =
    useSessionStorage<CredentialResponse | null>('credentials', null);

  const onLoginSuccess = (credential: CredentialResponse) => {
    setCredentials(credential);
    setStoredCredentials(credential);
  };

  console.log('credentials', credentials);
  useEffect(() => {
    // Only update if credentials are different
    if (
      storedCredentials &&
      (!credentials || credentials.credential !== storedCredentials.credential)
    ) {
      setCredentials(storedCredentials);
    }
  }, [setCredentials, storedCredentials, credentials]);

  return { credentials, isLoggedIn, onLoginSuccess } as const;
};
