import { Table, TableHeader, TableHeaderCell } from '@adg/client-components';
import { useParams } from 'react-router-dom';
import { useHoldingsOverview } from '@adg/client-graphql-data';

export const HoldingsOverViewTable: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const { data, loading, error } = useHoldingsOverview(portfolioId ?? '');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Table>
      <TableHeader>
        <caption>Holdings Overview Table</caption>
        <TableHeaderCell>Symbol</TableHeaderCell>
        <TableHeaderCell>Name</TableHeaderCell>
      </TableHeader>
    </Table>
  );
};
