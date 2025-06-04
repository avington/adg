import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export interface HeadingValuePctProps {
  color: string;
  value: number;
}

export const StyledHeadingValuePct = styled.span<
  PropsWithChildren<{ $color: string }>
>`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ $color }) => $color};
  margin: 0;
  padding: 0 0 0.5rem 0;
  align-self: start;
`;

export const HeadingValuePct = ({
  value,
  color,
}: {
  value: number;
  color: string;
}) => {
  const formattedValue = `${value.toFixed(1)}%`;
  return (
    <StyledHeadingValuePct $color={color}>
      ({formattedValue})
    </StyledHeadingValuePct>
  );
};
