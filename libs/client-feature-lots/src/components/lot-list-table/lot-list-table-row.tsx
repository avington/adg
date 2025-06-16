import { LotProjection } from '@adg/server-domain-read-models';

export interface LotListTableRowProps {
  lot: LotProjection;
  onEdit: (lot: LotProjection) => void;
  onDelete: (lot: LotProjection) => void;
}

export const LotListTableRow: React.FC<{
  lot: LotProjection;
  onEdit: (lot: LotProjection) => void;
  onDelete: (lot: LotProjection) => void;
}> = ({ lot, onEdit, onDelete }) => {
  return (
    <tr>
      <td>{lot.openDate.toLocaleDateString()}</td>
      <td>{lot.transactionType}</td>
      <td>{lot.shares}</td>
      <td>{lot.price ? `$${lot.price.toFixed(2)}` : '-'}</td>
      <td>
        <button
          onClick={() => onEdit(lot)}
          aria-label="Edit lot"
          title="Edit lot"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(lot)}
          aria-label="Delete lot"
          title="Delete lot"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
