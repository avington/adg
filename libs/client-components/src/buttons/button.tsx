import React from 'react';
import styled, { css } from 'styled-components';

type ButtonMode =
  | 'primary'
  | 'secondary'
  | 'transparent'
  | 'outlined'
  | 'white'
  | 'success'
  | 'error'
  | 'warning';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: ButtonMode;
  size?: ButtonSize;
}

const modeStyles = {
  primary: css`
    background: var(--color-blue-700);
    color: var(--color-white);
    border: none;
    &:hover {
      background: var(--color-blue-800);
    }
  `,
  secondary: css`
    background: var(--color-grey-200);
    color: var(--color-grey-900);
    border: none;
    &:hover {
      background: var(--color-grey-300);
    }
  `,
  transparent: css`
    background: transparent;
    color: var(--color-blue-700);
    border: none;
    &:hover {
      background: var(--color-grey-100);
    }
  `,
  outlined: css`
    background: transparent;
    color: var(--color-blue-700);
    border: 1px solid var(--color-blue-700);
    &:hover {
      background: var(--color-blue-50);
    }
  `,
  white: css`
    background: var(--color-white);
    color: var(--color-grey-900);
    border: 1px solid var(--color-grey-200);
    &:hover {
      background: var(--color-grey-100);
    }
  `,
  success: css`
    background: var(--color-green-600);
    color: var(--color-white);
    border: none;
    &:hover {
      background: var(--color-green-700);
    }
  `,
  error: css`
    background: var(--color-red-600);
    color: var(--color-white);
    border: none;
    &:hover {
      background: var(--color-red-700);
    }
  `,
  warning: css`
    background: var(--color-orange-500);
    color: var(--color-white);
    border: none;
    &:hover {
      background: var(--color-orange-700);
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
