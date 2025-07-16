import {
  Button,
  StyledNameLink,
  TableCell,
  TableRow,
} from '@adg/client-components';
import { PortfolioProjection } from '@adg/server-domain-read-models';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export interface PortfolioListTableRowProps {
  portfolio: PortfolioProjection;
  onEdit: (portfolio: PortfolioProjection) => void;
  onDelete: (portfolio: PortfolioProjection) => void;
}

export const StyledActionCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
`;

export const PortfolioListTableRow: React.FC<PortfolioListTableRowProps> = ({
  portfolio,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleNameClick = () => {
    navigate(`/portfolio/${portfolio.portfolioId}/holdings`);
  };

  return (
    <TableRow>
      <TableCell>
        <StyledNameLink
          onClick={handleNameClick}
          aria-label={`View holdings for ${portfolio.name}`}
        >
          {portfolio.name}
        </StyledNameLink>
      </TableCell>
      <TableCell>
        <StyledActionCell>
          <Button
            onClick={() => onEdit(portfolio)}
            aria-label="Edit portfolio"
            title="Edit portfolio"
            mode={'transparent'}
            size="sm"
          >
            <EditIcon fontSize="small" />
          </Button>
          <Button
            onClick={() => onDelete(portfolio)}
            aria-label="Delete portfolio"
            title="Delete portfolio"
            mode={'transparent'}
            size="sm"
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </StyledActionCell>
      </TableCell>
    </TableRow>
  );
};
