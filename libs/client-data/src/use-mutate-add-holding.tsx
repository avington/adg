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
    try {
      const response = await axios.post<PositionCreateRequestModel>(
        `${VITE_API_BASE_URL}/positions`,
        { ...holding, symbol: holding.symbol.toUpperCase() }
      );
      setData(response.data);
      if (onSuccess && !!response.data) {
        onSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || 'An error occurred');
      } else {
        setErrorMessage('An unexpected error occurred inserting a holding');
      }
    } finally {
      setFalse();
    }
  };

  return {
    loading,
    errorMessage,
    data,
    addHolding,
  };
};
