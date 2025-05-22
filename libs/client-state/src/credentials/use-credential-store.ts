import { CredentialResponse } from '@react-oauth/google';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface CredentialStore {
  isLoggedIn: boolean;
  credentials: CredentialResponse | null;
}

export type CredentialStoreAction = {
  setCredentials: (credentials: CredentialResponse | null) => void;
};

export const useCredentialStore = create<
  CredentialStore & CredentialStoreAction
>()(
  immer((set) => ({
    isLoggedIn: false,
    credentials: null,
    setCredentials: (credentials: CredentialResponse | null) => {
      set((draft) => {
        draft.credentials = credentials;
        draft.isLoggedIn = !!credentials;
      });
    },
  }))
);
