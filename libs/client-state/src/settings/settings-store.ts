import { create } from 'zustand';
import { createSelectors } from '../create-selectors';
import { immer } from 'zustand/middleware/immer';

export interface SettingsState {
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

export const useSettingsStore = createSelectors(
  create<SettingsState>()(
    immer((set) => ({
      apiUrl: '',
      setApiUrl: (url: string) => {
        set((state) => {
          state.apiUrl = url;
        });
      },
    }))
  )
);
