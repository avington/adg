import axios from 'axios';
import { LotModel } from '@adg/global-validations';
import { useState } from 'react';
import { VITE_API_BASE_URL } from './constants';

export const useAddLot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LotModel | null>(null);

  const addLot = async (lot: LotModel, onSuccess?: () => void) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<LotModel>(
        `${VITE_API_BASE_URL}/lots`,
        lot
      );
      setData(response.data);

      if (onSuccess) onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, addLot };
};

export const useUpdateLot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LotModel | null>(null);

  const updateLot = async (
    lotId: string,
    lot: LotModel,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<LotModel>(
        `${VITE_API_BASE_URL}/lots/${lotId}`,
        lot
      );
      setData(response.data);
      if (onSuccess) onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err);
        setError(err.response?.data?.message || 'An error occurred');
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, updateLot };
};

export const useSaveLot = (lotId?: string) => {
  const { addLot, loading: addLoading, error: addError } = useAddLot();
  const {
    updateLot,
    loading: updateLoading,
    error: updateError,
  } = useUpdateLot();

  const saveLot = async (lot: LotModel, onSuccess?: () => void) => {
    if (lotId) {
      const response = await updateLot(lotId, lot);
      if (onSuccess) onSuccess();
      return response;
    } else {
      const response = await addLot(lot);
      if (onSuccess) onSuccess();
      return response;
    }
  };

  return {
    saveLot,
    loading: addLoading || updateLoading,
    error: addError || updateError,
  };
};
export const useDeleteLot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteLot = async (lotId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${VITE_API_BASE_URL}/lots/${lotId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteLot };
};
