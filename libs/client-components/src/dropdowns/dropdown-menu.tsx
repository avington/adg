import { animated } from 'react-spring';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ButtonHTMLAttributes } from 'react';

interface DropdownContainerProps {
  'data-dropdown'?: boolean;
  children?: React.ReactNode;
}

interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  'aria-expanded'?: boolean;
  'aria-haspopup'?:
    | boolean
    | 'dialog'
    | 'menu'
    | 'grid'
    | 'listbox'
    | 'tree'
    | 'true'
    | 'false';
  'aria-label'?: string;
}

export const DropdownContainer = styled.div.attrs<DropdownContainerProps>(
  (props) => ({
    'data-dropdown': props['data-dropdown'] || true,
  })
)<DropdownContainerProps>`
  position: relative;
  display: inline-block;
`;

export const DropdownTrigger = styled.button<DropdownTriggerProps>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: var(--color-indigo-900);
  font-weight: 700;
  cursor: pointer;
  font-size: inherit;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background-color: #f5f5f5;
  }

  &:focus {
    outline: 2px solid #1976d2;
    outline-offset: 2px;
  }
`;

export const DropdownMenu = styled(animated.div)`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
`;

export const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: var(--color-blue-grey-900);
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }

  &[aria-current='page'] {
    background-color: #e3f2fd;
    color: #1976d2;
    font-weight: 500;
  }
`;
