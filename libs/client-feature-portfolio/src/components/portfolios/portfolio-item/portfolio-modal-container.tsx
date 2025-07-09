import { PortfolioCreateModel } from '@adg/global-validations';
import { PortfolioModalForm } from './portfolio-modal-form';
import { useCreatePortfolio } from '@adg/client-data';
import { Toaster, useToaster } from '@adg/client-components';

export interface PortfolioModalContainerProps {
  close?: () => void;
}

export const PortfolioModalContainer = ({
  close,
}: PortfolioModalContainerProps) => {
  const { showSuccess, showError } = useToaster();
  const { createPortfolio } = useCreatePortfolio({
    onSuccess: (data) => {
      showSuccess(`Portfolio ${data.name} has been created successfully.`);
      close?.();
    },
    onError: (error) => {
      showError(`Failed to create portfolio: ${error}`);
    },
  });

  const initialPortfolio: PortfolioCreateModel = {
    portfolioId: '',
    name: '',
    description: '',
    isActive: true,
    createdAt: new Date(),
    lastUpdatedBy: '',
  };

  const save = async (portfolio: PortfolioCreateModel) => {
    await createPortfolio(portfolio);
    console.log('save', portfolio);
    close?.();
  };

  return (
    <PortfolioModalForm
      portfolio={initialPortfolio}
      onSave={save}
      onCancel={close}
    />
  );
};
