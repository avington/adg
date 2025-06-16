export interface LotListTableRowProps {
  tableRows: number;
}

export const NoRecordsTableRow: React.FC<LotListTableRowProps> = ({
  tableRows,
}) => {
  return (
    <tr>
      <td colSpan={tableRows} style={{ textAlign: 'center', padding: '16px' }}>
        No records found
      </td>
    </tr>
  );
};
