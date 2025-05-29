import styled from 'styled-components';
import AllHoldingsHeader from '../components/portfolios/all-holdings-header/all-holdings-header';

const StyledPortfolioView = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header'
    'content';
  gap: 20px;
`;

export const PortfolioView = () => {
  return (
    <StyledPortfolioView>
      <div style={{ gridArea: 'header' }}>
        <AllHoldingsHeader />
      </div>
      <div style={{ gridArea: 'content' }}></div>
    </StyledPortfolioView>
  );
};
export default PortfolioView;
