import { PortfolioModel } from '@adg/global-models';

export interface PortfolioModalContainerProps {
  save: (portfolio: PortfolioModel) => void;
}

export const PortfolioModalContainer = ({
  save,
}: PortfolioModalContainerProps) => {
  return <div>Portfolio Modal Container</div>;
};
