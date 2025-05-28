import { CredentialResponse } from '@react-oauth/google';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '../create-selectors';

export interface CredentialStore {
  isLoggedIn: boolean;
  credentials: CredentialResponse | null;
}

export type CredentialStoreAction = {
  setCredentials: (credentials: CredentialResponse | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const useCredentialStoreBase = create<
  CredentialStore & CredentialStoreAction
>()(
  immer((set) => ({
    isLoggedIn: false,
    credentials: null,
    setIsLoggedIn: (isLoggedIn: boolean) => {
      set((draft) => {
        draft.isLoggedIn = isLoggedIn;
      });
    },
    setCredentials: (credentials: CredentialResponse | null) => {
      set((draft) => {
        draft.credentials = credentials;
        draft.isLoggedIn = !!credentials;
      });
    },
  }))
);

export const useCredentialStore = createSelectors(useCredentialStoreBase);
