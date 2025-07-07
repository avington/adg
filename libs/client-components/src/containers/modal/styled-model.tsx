import styled from 'styled-components';
import React from 'react';

interface ModalContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

interface ModalContentProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

export const StyledModalContainer = styled.div<ModalContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const StyledModalContent = styled.div<ModalContentProps>`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const StyledModalTitle = styled.div.attrs(() => ({}))<
  React.HTMLAttributes<HTMLDivElement>
>`
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-primary);
`;
