import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '../createSelectors';
import axios from 'axios';

interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = createSelectors(
  create<UserState>()(
    immer((set) => ({
      user: null,
      loading: false,
      error: null,
      fetchUser: async () => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          const response = await axios.get('/api/auth');
          if (response.status !== 200) {
            throw new Error('Failed to fetch user');
          }
          const data = await response.data;
          set((state) => {
            state.user = data;
            state.loading = false;
          });
        } catch (err: any) {
          set((state) => {
            state.error = err.message || 'Unknown error';
            state.loading = false;
          });
        }
      },
    }))
  )
);
