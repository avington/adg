import { animated } from 'react-spring';
import styled from 'styled-components';

export const TabButton = styled(animated.button)<{ $isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: ${(props) =>
    props.$isActive
      ? 'var(--color-deep-purple-800)'
      : 'var(--color-blue-gray-500)'};
  color: ${(props) =>
    props.$isActive ? 'var(--color-white)' : 'var(--color-blue-gray-800)'};
  font-weight: ${(props) => (props.$isActive ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  font-size: 14px;

  &:hover {
    background: ${(props) =>
      props.$isActive
        ? 'var(--color-deep-purple-900)'
        : 'var(--color-purple-50)'};
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;
