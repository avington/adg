import {
  NoRecordsTableRow,
  RenderWhen,
  Table,
  TableHeader,
  TableHeaderCell,
} from '@adg/client-components';
import { useParams } from 'react-router-dom';
import { useHoldingsOverview } from '@adg/client-graphql-data';
import { HoldingsOverViewTableRow } from './holding-overview-table-row';

export const HoldingsOverViewTable: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const { data, loading, error } = useHoldingsOverview(portfolioId ?? '');
  const holdings = data?.positionOverviews || [];
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Table>
      <caption>Holdings</caption>
      <TableHeader>
        <TableHeaderCell>Symbol</TableHeaderCell>
        <TableHeaderCell> </TableHeaderCell>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Price</TableHeaderCell>
        <TableHeaderCell>Shares</TableHeaderCell>
        <TableHeaderCell>Mkt Value</TableHeaderCell>
        <TableHeaderCell>$ Cost Avg</TableHeaderCell>
      </TableHeader>
      <tbody>
        <RenderWhen>
          <RenderWhen.If isTrue={holdings.length > 0}>
            {holdings.map((holding) => (
              <HoldingsOverViewTableRow
                key={holding.symbol}
                holdingsOverview={holding}
              />
            ))}
          </RenderWhen.If>
          <RenderWhen.If isTrue={holdings.length === 0}>
            <NoRecordsTableRow tableSpan={7} />
          </RenderWhen.If>
        </RenderWhen>
      </tbody>
    </Table>
  );
};
