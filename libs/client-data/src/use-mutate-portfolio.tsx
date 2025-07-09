import { useBoolean } from '@adg/client-hooks';
import { PortfolioCreateModel } from '@adg/global-validations';
import axios from 'axios';
import { useState } from 'react';
import { VITE_API_BASE_URL } from './constants';

export interface UseCreatePortfolioProps {
  onSuccess?: (data: PortfolioCreateModel) => void;
  onError?: (error: string) => void;
}

export const useCreatePortfolio = ({
  onSuccess,
  onError,
}: UseCreatePortfolioProps) => {
  const { value: isLoading, setTrue, setFalse } = useBoolean(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioCreateModel | null>(null);
  const createPortfolio = async (portfolio: PortfolioCreateModel) => {
    setTrue();
    try {
      const response = await axios.post<PortfolioCreateModel>(
        `${VITE_API_BASE_URL}/portfolios`,
        portfolio
      );
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError(axios.isAxiosError(err) ? err.message : 'Unknown error');
      if (onError) {
        onError(axios.isAxiosError(err) ? err.message : 'Unknown error');
      }
    } finally {
      setFalse();
    }
  };

  return { isLoading, error, data, createPortfolio };
};
