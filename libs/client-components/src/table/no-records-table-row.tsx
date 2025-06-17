export interface NoRecordsTableRowProps {
  tableSpan: number;
}

export const NoRecordsTableRow: React.FC<NoRecordsTableRowProps> = ({
  tableSpan,
}) => {
  return (
    <tr>
      <td colSpan={tableSpan} style={{ textAlign: 'center', padding: '16px' }}>
        No records found
      </td>
    </tr>
  );
};
