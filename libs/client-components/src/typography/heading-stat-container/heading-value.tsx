import styled from 'styled-components';
import type { PropsWithChildren } from 'react';

export interface HeadingValueProps {
  $color: string;
}

export const HeadingValue = styled.span<PropsWithChildren<HeadingValueProps>>`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ $color }) => $color};
  margin: 0;
  padding: 0 0 0.5rem 0;
  align-self: start;
`;
