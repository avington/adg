import { PortfolioProjection } from '@adg/server-domain-read-models';
import { StyledActionTableContainer } from '@adg/client-theme';
import {
  NoRecordsTableRow,
  Table,
  TableHeader,
  TableHeaderCell,
} from '@adg/client-components';
import { PortfolioListTableRow } from './portfolio-list-table-row';

export interface PortfolioListTableProps {
  portfolios: PortfolioProjection[] | undefined;
}

export const PortfolioListTable: React.FC<PortfolioListTableProps> = ({
  portfolios,
}) => {
  return (
    <StyledActionTableContainer>
      <Table>
        <caption>Portfolios</caption>
        <TableHeader>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell> </TableHeaderCell>
        </TableHeader>
        <tbody>
          {portfolios && portfolios.length > 0 ? (
            portfolios.map((portfolio) => (
              <PortfolioListTableRow
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={(item) => console.log('on edit', item)}
                onDelete={(item) => console.log('on delete', item)}
              />
            ))
          ) : (
            <NoRecordsTableRow tableSpan={2} />
          )}
        </tbody>
      </Table>
    </StyledActionTableContainer>
  );
};
export default PortfolioListTable;
