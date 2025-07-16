import type { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export const StyledNameLink = styled.button<
  ButtonHTMLAttributes<HTMLButtonElement>
>`
  background: none;
  border: none;
  padding: 0;
  color: var(--color-blue-700);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  text-align: left;

  &:hover {
    color: #1976d2;
  }
`;
