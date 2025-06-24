import { useContext } from 'react';
import { ToasterContext } from './toaster-context';

/**
 * Custom hook to access the Toaster context.
 * This hook should be used within a ToasterProvider.
 *
 * @returns {object} An object containing toaster methods and status.
 * @throws {Error} If used outside of a ToasterProvider.
 */
export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }

  const { showToaster, showStatus } = context;

  return {
    showToaster,
    showStatus,
    // Convenience methods for different message types
    showSuccess: (message: string, duration?: number) =>
      showToaster(message, duration, 'success'),
    showError: (message: string, duration?: number) =>
      showToaster(message, duration, 'error'),
    showWarning: (message: string, duration?: number) =>
      showToaster(message, duration, 'warning'),
    showInfo: (message: string, duration?: number) =>
      showToaster(message, duration, 'info'),
  };
};

// Keep the old export for backward compatibility
export const UseToaster = useToaster;
