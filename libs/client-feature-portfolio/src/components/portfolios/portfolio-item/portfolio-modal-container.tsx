import { PortfolioModel } from '@adg/global-models';

export interface PortfolioModalContainerProps {
  save: (portfolio: PortfolioModel) => void;
  cancel?: () => void;
}

export const PortfolioModalContainer = ({
  save,
  cancel,
}: PortfolioModalContainerProps) => {
  return <div>Portfolio Modal Container</div>;
};
