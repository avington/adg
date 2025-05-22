import { CredentialResponse } from '@react-oauth/google';
import { useSessionStorage } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { useCredentialStore } from '@adg/client-state';
import axios from 'axios';

export const useAuthentication = () => {
  // state
  const credentials = useCredentialStore.use.credentials();
  const isLoggedIn = useCredentialStore.use.isLoggedIn();
  const setCredentials = useCredentialStore.use.setCredentials();

  const [storedCredentials, setStoredCredentials] =
    useSessionStorage<CredentialResponse | null>('credentials', null);

  const onLoginSuccess = (credential: CredentialResponse) => {
    setCredentials(credential);
    setStoredCredentials(credential);
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${credential.credential}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
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
