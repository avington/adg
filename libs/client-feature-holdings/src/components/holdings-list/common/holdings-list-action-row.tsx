import { Button, StyledActionRow } from '@adg/client-components';
import { MouseEventHandler } from 'react';

export interface HoldingsListActionRowProps {
  onAddHolding: MouseEventHandler<HTMLButtonElement>;
}

export const HoldingsListActionRow: React.FC<HoldingsListActionRowProps> = ({
  onAddHolding,
}) => {
  return (
    <StyledActionRow>
      <Button mode="primary" size="md" onClick={onAddHolding}>
        Add Holding
      </Button>
    </StyledActionRow>
  );
};
