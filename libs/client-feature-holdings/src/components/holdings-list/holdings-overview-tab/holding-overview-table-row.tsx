import { MenuButton, TableCell, TableRow } from '@adg/client-components';
import { toDollar } from '@adg/client-components';
import { WithLatestQuote } from '@adg/global-models';
import { calculateMarketValue } from '@adg/global-formulas';
import { PositionOverviewProjection } from '@adg/global-read-models';
import { useNavigate } from 'react-router-dom';

// Utility function to calculate cost basis
function calculateCostBasis(
  totalShares?: number,
  averagePrice?: number
): number {
  return (averagePrice ?? 0) * (totalShares ?? 0);
}

export interface HoldingsOverViewTableProps {
  holdingsOverview: WithLatestQuote<PositionOverviewProjection>;
}

export const HoldingsOverViewTableRow: React.FC<HoldingsOverViewTableProps> = ({
  holdingsOverview,
}) => {
  const navigate = useNavigate();
  return (
    <TableRow>
      <TableCell>{holdingsOverview.symbol.toLocaleUpperCase()}</TableCell>
      <TableCell>
        <MenuButton
          items={[
            {
              title: 'Lots',
              onClick: () =>
                navigate(
                  `/portfolio/${holdingsOverview.portfolioId}/holdings/${holdingsOverview.symbol}/lots`
                ),
            },
            {
              title: 'Action 2',
              onClick: () => alert('Action 2 clicked'),
            },
          ]}
        />
      </TableCell>
      <TableCell>{holdingsOverview.summary.companyName}</TableCell>
      <TableCell>
        {toDollar(holdingsOverview.latestQuote?.price ?? 0)}
      </TableCell>
      <TableCell>{holdingsOverview.lots?.totalShares}</TableCell>
      <TableCell>
        {toDollar(
          calculateMarketValue({
            totalShares: holdingsOverview.lots?.totalShares,
            price: holdingsOverview.latestQuote?.price,
          })
        )}
      </TableCell>

      <TableCell>
        {toDollar(
          calculateCostBasis(
            holdingsOverview.lots?.totalShares,
            holdingsOverview.lots?.averagePrice
          )
        )}
      </TableCell>
    </TableRow>
  );
};
