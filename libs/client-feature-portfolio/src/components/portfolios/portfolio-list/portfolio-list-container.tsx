import {
  Button,
  LoadingOverlay,
  Modal,
  RenderWhen,
  StyledActionRow,
  StyledTableContainer,
  useToaster,
} from '@adg/client-components';
import { useAllPortfolios } from '@adg/client-graphql-data';
import { useBoolean } from '@adg/client-hooks';
import IconAdd from '@mui/icons-material/Add';
import { useCallback } from 'react';
import { PortfolioModalContainer } from '../portfolio-item/portfolio-modal-container';
import PortfolioListTable from './portfolio-list-table';
import { PortfolioCreateModel } from '@adg/global-validations';

export const PortfolioListContainer: React.FC = () => {
  const toaster = useToaster();

  const { setTrue: open, setFalse: close, value: isOpen } = useBoolean();

  const { loading, error, data: portfolioData } = useAllPortfolios();

  const handleAddPortfolio = useCallback(() => {
    open();
  }, [open]);

  return (
    <>
      <StyledTableContainer>
        <StyledActionRow>
          <Button mode={'success'} size={'md'} onClick={handleAddPortfolio}>
            <IconAdd style={{ marginRight: '0.7rem' }} />
            Add Portfolio
          </Button>
        </StyledActionRow>
        <RenderWhen>
          <RenderWhen.If isTrue={loading}>
            <LoadingOverlay isLoading={loading} />
          </RenderWhen.If>
          <RenderWhen.If isTrue={!!error}>
            <div style={{ color: 'red', padding: '1rem' }}>
              Failed to load portfolios. Please try again later.
            </div>
          </RenderWhen.If>
          <RenderWhen.If isTrue={!loading && !error}>
            <PortfolioListTable
              portfolios={portfolioData?.portfolios}
              onDelete={(item) => console.log('delete', item)}
              onEdit={(item) => console.log('edit', item)}
            />
          </RenderWhen.If>
        </RenderWhen>
      </StyledTableContainer>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Create Portfolio"
        showCloseButton={true}
        modalWidth="wide"
      >
        <PortfolioModalContainer close={close} />
      </Modal>
    </>
  );
};
