import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  LoadingOverlay,
  RenderWhen,
  StyledTableContainer,
} from '@adg/client-components';
import { StyledHeaderBodyContainer } from '@adg/client-theme';

export const HoldingsListView: React.FC = () => {
  const { portfolioId } = useParams<{
    portfolioId: string;
  }>();
  return <StyledHeaderBodyContainer></StyledHeaderBodyContainer>;
};

export default HoldingsListView;
