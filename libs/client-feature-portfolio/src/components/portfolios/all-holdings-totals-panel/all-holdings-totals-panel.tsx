import styled from 'styled-components';
import { HeadingContainer, LargeDollar } from '@adg/client-components';

const StyledAllHoldingsTotalsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'total total total'
    'cash day unrealized';
  gap: 1rem;
`;

/*
 * AllHoldingsTotalsPanel component displays the total value of all holdings,
 * cash, day change, and unrealized gains in a grid layout.
 */
export function AllHoldingsTotalsPanel() {
  return (
    <StyledAllHoldingsTotalsPanel>
      <LargeDollar value={999999} decimals={0} />
      <HeadingContainer
        gridArea="cash"
        label="Cash"
        value={60000}
        colorize={false}
        showDollar={true}
        decimals={0}
      />
      <HeadingContainer
        gridArea="day"
        label="Day Change"
        value={600000}
        percentage={1.1}
        colorize={true}
        showDollar={true}
        decimals={0}
      />
      <HeadingContainer
        gridArea="unrealized"
        label="Unrealized Gains"
        value={12345}
        percentage={15.1}
        colorize={true}
        showDollar={true}
        decimals={0}
      />
    </StyledAllHoldingsTotalsPanel>
  );
}

export default AllHoldingsTotalsPanel;
