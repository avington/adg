import { Button, TableRow, TableCell } from '@adg/client-components';
import { LotProjection } from '@adg/server-domain-read-models';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export interface LotListTableRowProps {
  lot: LotProjection;
  onEdit: (lot: LotProjection) => void;
  onDelete: (lot: LotProjection) => void;
}

export const LotListTableRow: React.FC<LotListTableRowProps> = ({
  lot,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow>
      <TableCell>
        {lot.openDate ? new Date(lot.openDate).toLocaleDateString() : '-'}
      </TableCell>
      <TableCell>{lot.transactionType}</TableCell>
      <TableCell>{lot.shares}</TableCell>
      <TableCell>{lot.price ? `$${lot.price.toFixed(2)}` : '-'}</TableCell>
      <TableCell>
        <Button
          onClick={() => onEdit(lot)}
          aria-label="Edit lot"
          title="Edit lot"
          mode={'transparent'}
          size="sm"
        >
          <IconEdit size={16} />
        </Button>
        <Button
          onClick={() => onDelete(lot)}
          aria-label="Delete lot"
          title="Delete lot"
          mode={'transparent'}
          size="sm"
        >
          <IconTrash size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
};
