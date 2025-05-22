import React from 'react';
import styled, { css } from 'styled-components';

type ButtonMode =
  | 'primary'
  | 'secondary'
  | 'transparent'
  | 'outlined'
  | 'white';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: ButtonMode;
  size?: ButtonSize;
}

const modeStyles = {
  primary: css`
    background: #2563eb;
    color: #fff;
    border: none;
    &:hover {
      background: #1d4ed8;
    }
  `,
  secondary: css`
    background: #e5e7eb;
    color: #111827;
    border: none;
    &:hover {
      background: #d1d5db;
    }
  `,
  transparent: css`
    background: transparent;
    color: #2563eb;
    border: none;
    &:hover {
      background: #f3f4f6;
    }
  `,
  outlined: css`
    background: transparent;
    color: #2563eb;
    border: 1px solid #2563eb;
    &:hover {
      background: #eff6ff;
    }
  `,
  white: css`
    background: #fff;
    color: #111827;
    border: 1px solid #e5e7eb;
    &:hover {
      background: #f3f4f6;
    }
  `,
};

const sizeStyles = {
  xs: css`
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
  `,
  sm: css`
    font-size: 0.875rem;
    padding: 0.375rem 1rem;
    border-radius: 0.375rem;
  `,
  md: css`
    font-size: 1rem;
    padding: 0.5rem 1.25rem;
    border-radius: 0.375rem;
  `,
  lg: css`
    font-size: 1.125rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
  `,
  xl: css`
    font-size: 1.25rem;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
  `,
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  ${(props) => modeStyles[props.mode || 'primary']}
  ${(props) => sizeStyles[props.size || 'md']}
    &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  mode = 'primary',
  size = 'md',
  ...rest
}) => (
  <StyledButton mode={mode} size={size} {...rest}>
    {children}
  </StyledButton>
);
