import { useCredentialStore, useUserStore } from '@adg/client-state';
import { CredentialResponse } from '@react-oauth/google';
import { useSessionStorage } from '@uidotdev/usehooks';
import axios from 'axios';
import { useEffect } from 'react';

export const useAuthentication = () => {
  // state
  const credentials = useCredentialStore.use.credentials();
  const isLoggedIn = useUserStore.use.isLoggedIn();
  const setIsLoggedIn = useUserStore.use.setIsLoggedIn();
  const setCredentials = useCredentialStore.use.setCredentials();
  const fetchUser = useUserStore.use.fetchUser();

  const [storedCredentials, setStoredCredentials] =
    useSessionStorage<CredentialResponse | null>('credentials', null);

  const onLoginSuccess = (credential: CredentialResponse) => {
    setCredentials(credential);
    setStoredCredentials(credential);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    // Only update if credentials are different
    const getCurrentUser = async () => {
      return await fetchUser();
    };

    if (
      storedCredentials &&
      (!credentials || credentials.credential !== storedCredentials.credential)
    ) {
      const token = credentials?.credential ?? storedCredentials?.credential;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';

      setCredentials(storedCredentials);
      getCurrentUser();
    }
  }, [setCredentials, storedCredentials, credentials, fetchUser]);

  return { credentials, isLoggedIn, onLoginSuccess } as const;
};
