export interface NoRecordsTableRowProps {
  tableRows: number;
}

export const NoRecordsTableRow: React.FC<NoRecordsTableRowProps> = ({
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
