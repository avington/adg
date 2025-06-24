import { createContext } from 'react';

export type ToasterMode = 'info' | 'success' | 'warning' | 'error';

export interface ToasterContextProps {
  showToaster: (message: string, duration?: number, mode?: ToasterMode) => void;
  showStatus: boolean;
}

export const ToasterContext = createContext<ToasterContextProps | null>(null);
