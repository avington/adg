import React from 'react';
import styled from 'styled-components';
import { getColor } from '../utils/get-color';
import { toDollar } from '../utils/to-dollar';

interface LargeDollarProps {
  value: number;
  decimals?: number;
  colorize?: boolean;
  className?: string;
}

const DollarText = styled.span<
  { $color: string } & React.HTMLAttributes<HTMLSpanElement>
>`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ $color }) => $color};
`;

export const LargeDollar: React.FC<LargeDollarProps> = ({
  value,
  decimals = 2,
  colorize = false,
  className,
}) => {
  const formatted = toDollar(value, decimals);

  return (
    <DollarText $color={getColor(value, colorize)} className={className}>
      {formatted}
    </DollarText>
  );
};
