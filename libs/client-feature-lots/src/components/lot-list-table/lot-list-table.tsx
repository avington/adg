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
      <h1>Lot List Table</h1>
      <div>
        <Table>
          <TableHeader>
            <TableHeaderCell>Open Date</TableHeaderCell>
            <TableHeaderCell>Buy / Sell</TableHeaderCell>
            <TableHeaderCell>Shares</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>
          <tbody>
            <TableRow>
              <TableCell>2023-10-01</TableCell>
              <TableCell>Buy</TableCell>
              <TableCell>100</TableCell>
              <TableCell>$50.00</TableCell>
              <TableCell>
                <button>Edit</button>
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
            <TableRow>
              <TableCell>2023-10-02</TableCell>
              <TableCell>Sell</TableCell>
              <TableCell>50</TableCell>
              <TableCell>$55.00</TableCell>
              <TableCell>
                <button>Edit</button>
                <button>Delete</button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2023-10-03</TableCell>
              <TableCell>Buy</TableCell>
              <TableCell>200</TableCell>
              <TableCell>$45.00</TableCell>
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
                  aria-label="Edit lot"
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
          </tbody>
        </Table>
      </div>
      {/* Add your table implementation here */}
    </StyledActionTableContainer>
  );
};
