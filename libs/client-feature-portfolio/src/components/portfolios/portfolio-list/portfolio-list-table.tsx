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
  onEdit: (portfolio: PortfolioProjection) => void;
  onDelete: (portfolio: PortfolioProjection) => void;
}

export const PortfolioListTable: React.FC<PortfolioListTableProps> = ({
  portfolios,
  onEdit,
  onDelete,
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
                key={portfolio.portfolioId}
                portfolio={portfolio}
                onEdit={onEdit}
                onDelete={onDelete}
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
