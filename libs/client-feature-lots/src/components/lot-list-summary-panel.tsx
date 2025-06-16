import styled from 'styled-components';

const StyledLotListSummaryPanel = styled.section`
  display: grid;
  width: 100%;
`;

export const LotListSummaryPanel: React.FC = () => {
  return (
    <StyledLotListSummaryPanel>
      <h2>Lot List Summary Panel</h2>
      <p>This panel summarizes the lot list.</p>
      {/* Add more content or components as needed */}
    </StyledLotListSummaryPanel>
  );
};
export default LotListSummaryPanel;
