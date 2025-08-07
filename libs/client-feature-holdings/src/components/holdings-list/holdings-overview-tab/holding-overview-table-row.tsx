import { MenuButton, TableCell, TableRow } from '@adg/client-components';
import { PositionOverviewProjection } from '@adg/global-read-models';
import { useNavigate } from 'react-router-dom';

export interface HoldingsOverViewTableProps {
  holdingsOverview: PositionOverviewProjection;
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
      <TableCell>{holdingsOverview.stockQuote.price}</TableCell>
      <TableCell>100</TableCell>
      <TableCell>200</TableCell>
      <TableCell>150</TableCell>
    </TableRow>
  );
};
