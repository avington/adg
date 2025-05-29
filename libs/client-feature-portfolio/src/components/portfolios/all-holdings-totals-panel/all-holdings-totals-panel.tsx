import styled from 'styled-components';

const StyledAllHoldingsTotalsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'total total total'
    'cash day unrealized';
  gap: 1rem;
`;

const StyledTotal = styled.div`
  grid-area: total;
  font-size: 2.5rem;
  font-weight: bold;
`;
const StyledCash = styled.div`
  grid-area: cash;
  font-size: 1.2rem;
  color: green;
`;
const StyledDayChange = styled.div`
  grid-area: day;
  font-size: 1.2rem;
  color: blue;
`;
const StyledUnrealized = styled.div`
  grid-area: unrealized;
  font-size: 1.2rem;
  color: orange;
`;
export function AllHoldingsTotalsPanel() {
  return (
    <StyledAllHoldingsTotalsPanel>
      <StyledTotal>$999,999</StyledTotal>
      <StyledCash>Cash Holdings: $10,000</StyledCash>
      <StyledDayChange>Day Change: +$500</StyledDayChange>
      <StyledUnrealized>Unrealized Gains: +$2,000</StyledUnrealized>
    </StyledAllHoldingsTotalsPanel>
  );
}

export default AllHoldingsTotalsPanel;
