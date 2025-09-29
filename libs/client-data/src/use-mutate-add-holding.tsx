import axios from 'axios';
import { useBoolean } from '@adg/client-hooks';
import { PositionCreateRequestModel } from '@adg/global-validations';
import { useState } from 'react';
import { VITE_API_BASE_URL } from './constants';

export const useMutateAddHolding = (onSuccess?: () => void) => {
  const { setTrue, setFalse, value: loading } = useBoolean(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<PositionCreateRequestModel | null>(null);

  const addHolding = async (holding: PositionCreateRequestModel) => {
    setTrue();
    setErrorMessage(null);
    const maxAttempts = 2; // one retry for transient network issues
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const upperSymbol = holding.symbol.toUpperCase();
        const url = `${VITE_API_BASE_URL}/positions`;
        const response = await axios.post<PositionCreateRequestModel>(url, {
          ...holding,
          symbol: upperSymbol,
        });
        setData(response.data);
        if (onSuccess && !!response.data) {
          onSuccess();
        }
        return; // success, exit function
      } catch (error) {
        const isAxios = axios.isAxiosError(error);
        if (isAxios) {
          const status = error.response?.status;
          const network = !error.response;
          // Detailed console diagnostics (dev only)
          if (import.meta.env.DEV) {
            console.error('[addHolding] attempt failed', {
              attempt,
              status,
              code: error.code,
              message: error.message,
              url: error.config?.url,
              baseURL: error.config?.baseURL,
              hasResponse: !!error.response,
            });
          }
          if (network && attempt < maxAttempts) {
            // Small backoff before retry
            await new Promise((r) => setTimeout(r, 250));
            continue; // retry loop
          }
          setErrorMessage(
            (error.response?.data as any)?.message ||
              (error.response?.data as any)?.error ||
              'Failed to create position'
          );
        } else {
          if (import.meta.env.DEV) {
            console.error('[addHolding] unexpected error', error);
          }
          setErrorMessage('Unexpected error inserting a holding');
        }
        return; // stop after reporting
      } finally {
        if (attempt === maxAttempts) {
          setFalse();
        }
      }
    }
  };

  return {
    loading,
    errorMessage,
    data,
    addHolding,
  };
};
