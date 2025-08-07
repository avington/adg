import {
  NoRecordsTableRow,
  RenderWhen,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@adg/client-components';
import { StyledActionTableContainer } from '@adg/client-theme';
import { LotProjection } from '@adg/global-read-models';
import { LotListTableRow } from './lot-list-table-row';

export interface LotListTableProps {
  lots: LotProjection[];
}

export const LotListTable: React.FC<LotListTableProps> = ({ lots }) => {
  return (
    <StyledActionTableContainer>
      <div>
        <Table>
          <caption>Lot List Table</caption>
          <TableHeader>
            <TableHeaderCell>Open Date</TableHeaderCell>
            <TableHeaderCell>Buy / Sell</TableHeaderCell>
            <TableHeaderCell>Shares</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>
          <tbody>
            <RenderWhen>
              <RenderWhen.If isTrue={lots.length === 0}>
                <NoRecordsTableRow tableSpan={5} />
              </RenderWhen.If>
              <RenderWhen.If isTrue={lots.length > 0}>
                {lots.map((lot) => (
                  <LotListTableRow
                    key={lot.lotId}
                    lot={lot}
                    onDelete={(item) => console.log('on delete', item)}
                    onEdit={(item) => console.log('on edit', item)}
                  />
                ))}
              </RenderWhen.If>
            </RenderWhen>
          </tbody>
        </Table>
      </div>
    </StyledActionTableContainer>
  );
};
