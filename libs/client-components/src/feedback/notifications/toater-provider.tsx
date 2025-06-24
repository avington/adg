import { PropsWithChildren, useState, useCallback } from 'react';
import {
  ToasterContext,
  ToasterContextProps,
  ToasterMode,
} from './toaster-context';
import { Toaster } from './toaster';

interface ToasterState {
  show: boolean;
  message: string;
  mode: ToasterMode;
  duration: number;
}

export const ToasterProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [toasterState, setToasterState] = useState<ToasterState>({
    show: false,
    message: '',
    mode: 'info',
    duration: 5000,
  });

  const showToaster = useCallback(
    (message: string, duration = 5000, mode: ToasterMode = 'info') => {
      setToasterState({
        show: true,
        message,
        mode,
        duration,
      });
    },
    []
  );

  const hideToaster = useCallback(() => {
    setToasterState((prev) => ({
      ...prev,
      show: false,
    }));
  }, []);

  const contextValue: ToasterContextProps = {
    showToaster,
    showStatus: toasterState.show,
  };

  return (
    <ToasterContext.Provider value={contextValue}>
      {children}
      <Toaster
        show={toasterState.show}
        message={toasterState.message}
        mode={toasterState.mode}
        duration={toasterState.duration}
        onClose={hideToaster}
      />
    </ToasterContext.Provider>
  );
};
