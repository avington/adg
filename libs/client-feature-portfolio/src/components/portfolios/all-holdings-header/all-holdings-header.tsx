import styled from 'styled-components';
import AllHoldingsOptionsPanel from '../all-holdings-options-panel/all-holdings-options-panel';
import AllHoldingsEarningsPanel from '../all-holdings-earnings-panel/all-holdings-earnings-panel';
import AllHoldingsTotalsPanel from '../all-holdings-totals-panel/all-holdings-totals-panel';

const StyledAllHoldingsHeader = styled.section`
  display: grid;
  grid-template-areas:
    'title title title'
    'total options earnings';
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
`;

export function AllHoldingsHeader() {
  return (
    <StyledAllHoldingsHeader>
      <h4 style={{ gridArea: 'title' }}>All Portfolio Holdings</h4>
      <div style={{ gridArea: 'total' }}>
        <AllHoldingsTotalsPanel />
      </div>
      <div style={{ gridArea: 'options' }}>
        <AllHoldingsOptionsPanel />
      </div>
      <div style={{ gridArea: 'earnings' }}>
        <AllHoldingsEarningsPanel />
      </div>
    </StyledAllHoldingsHeader>
  );
}

export default AllHoldingsHeader;
