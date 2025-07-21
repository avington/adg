import { HeadingContainer } from '@adg/client-components';
import { StyledHoldingsHeadingSummary } from './styled-holdings-heading-summary';

export const HoldingsHeadingSummary: React.FC = () => {
  return (
    <StyledHoldingsHeadingSummary>
      <HeadingContainer
        label="Portfolio Value"
        value={100000}
        showDollar={true}
      />
      <HeadingContainer label="Cost" value={80000} showDollar={true} />
      <HeadingContainer
        label="Total Gains"
        value={20000}
        percentage={25}
        showDollar={true}
        colorize={true}
      />
      <HeadingContainer
        label="Daily Gains"
        value={500}
        percentage={0.5}
        showDollar={true}
        colorize={true}
      />
    </StyledHoldingsHeadingSummary>
  );
};
