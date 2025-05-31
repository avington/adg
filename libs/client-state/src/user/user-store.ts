import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '../create-selectors';
import { UserModel } from '@adg/global-models';

interface UserState {
  user: UserModel | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean; // Added property
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = createSelectors(
  create<UserState>()(
    immer((set) => ({
      user: null,
      loading: false,
      error: null,
      isLoggedIn: false, // Initialize
      setIsLoggedIn: (isLoggedIn: boolean) => {
        set((state) => {
          state.isLoggedIn = isLoggedIn;
        });
      },
      fetchUser: async () => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          const response = await axios.get('/auth');
          if (response.status !== 200) {
            throw new Error('Failed to fetch user');
          }
          const data = await response.data;
          set((state) => {
            state.user = data;
            state.loading = false;
            state.isLoggedIn = true; // Set to true on success
          });
        } catch (err) {
          set((state) => {
            state.error = (err as AxiosError).message || 'Unknown error';
            state.loading = false;
            // Set isLoggedIn to false if 401 error
            if (
              axios.isAxiosError(err) &&
              err.response &&
              err.response.status === 401
            ) {
              state.isLoggedIn = false;
            }
          });
        }
      },
    }))
  )
);
