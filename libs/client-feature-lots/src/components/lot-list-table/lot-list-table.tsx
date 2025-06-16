import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  Button,
} from '@adg/client-components';
import { StyledActionTableContainer } from '@adg/client-theme';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export const LotListTable: React.FC = () => {
  return (
    <StyledActionTableContainer>
      <div>
        <Table>
          <caption>Lot List Table</caption>
          <TableHeader>
            <TableHeaderCell>Open Date</TableHeaderCell>
            <TableHeaderCell>Buy / Sell</TableHeaderCell>
            <TableHeaderCell>Shares</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>
          <tbody>
            {[
              {
                id: 1,
                date: '2023-10-01',
                type: 'Buy',
                shares: 100,
                price: '$50.00',
              },
              {
                id: 2,
                date: '2023-10-02',
                type: 'Sell',
                shares: 50,
                price: '$55.00',
              },
              {
                id: 3,
                date: '2023-10-03',
                type: 'Buy',
                shares: 200,
                price: '$45.00',
              },
            ].map((lot, index) => (
              <TableRow key={lot.id}>
                <TableCell>{lot.date}</TableCell>
                <TableCell>{lot.type}</TableCell>
                <TableCell>{lot.shares}</TableCell>
                <TableCell>{lot.price}</TableCell>
                <TableCell>
                  <Button
                    mode={'transparent'}
                    size="sm"
                    aria-label="Edit lot"
                    title="Edit lot"
                  >
                    <IconEdit size={16} aria-hidden="true" focusable="false" />
                  </Button>
                  <Button
                    mode={'transparent'}
                    size="sm"
                    aria-label="Delete lot"
                    title="Delete lot"
                  >
                    <IconTrash
                      size={16}
                      aria-hidden="true"
                      focusable="false"
                      style={{ color: 'var(--color-red-500)' }}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </StyledActionTableContainer>
  );
};
