import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { getColor } from '../../utils/get-color';
import { toDollar } from '../../utils/to-dollar';
import { HeadingLabel } from './heading-label';
import { HeadingValue } from './heading-value';
import { HeadingValuePct } from './heading-value-pct';

interface StyledHeadingContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  $gridArea?: string;
}

export const StyledHeadingContainer = styled.div<StyledHeadingContainerProps>`
  display: grid;
  display-template-columns: 1fr;
  display-template-rows: 1fr 1fr;
  width: 100%;
  height: 100%;
  justify-content: left;
  align-items: center;
  grid-area: ${({ $gridArea }) => $gridArea || 'auto'};
`;

export interface HeadingContainerProps {
  label: string;
  value: number;
  percentage?: number;
  colorize?: boolean;
  showDollar?: boolean;
  decimals?: number;
  gridArea?: string;
}

export const HeadingContainer: React.FC<HeadingContainerProps> = ({
  label,
  value,
  percentage,
  colorize = false,
  showDollar = false,
  decimals = 2,
  gridArea,
}) => {
  return (
    <StyledHeadingContainer $gridArea={gridArea}>
      <HeadingLabel>{label}</HeadingLabel>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <HeadingValue $color={getColor(value, colorize)}>
          {showDollar ? toDollar(value, decimals) : value}
        </HeadingValue>

        {percentage ? (
          <HeadingValuePct
            value={percentage}
            color={getColor(value, colorize)}
          />
        ) : null}
      </div>
    </StyledHeadingContainer>
  );
};
