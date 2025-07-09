import styled from 'styled-components';
import React from 'react';

export type ModalWidth = 'wide' | 'medium' | 'thin';

interface ModalContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  modalWidth?: ModalWidth;
}

interface ModalContentProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
  modalWidth?: ModalWidth;
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

export const StyledModalContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'modalWidth',
})<ModalContentProps>`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;

  /* Width variants with responsive design */
  ${({ modalWidth = 'medium' }) => {
    switch (modalWidth) {
      case 'thin':
        return `
          width: 90vw;
          max-width: 400px;
          
          @media (max-width: 768px) {
            width: 95vw;
            max-width: 320px;
          }
          
          @media (max-width: 480px) {
            width: 95vw;
            max-width: 280px;
            padding: 1rem;
          }
        `;
      case 'wide':
        return `
          width: 95vw;
          max-width: 800px;
          
          @media (max-width: 1024px) {
            width: 90vw;
            max-width: 700px;
          }
          
          @media (max-width: 768px) {
            width: 95vw;
            max-width: 600px;
          }
          
          @media (max-width: 480px) {
            width: 95vw;
            max-width: none;
            padding: 1rem;
          }
        `;
      case 'medium':
      default:
        return `
          width: 90vw;
          max-width: 500px;
          
          @media (max-width: 768px) {
            width: 95vw;
            max-width: 400px;
          }
          
          @media (max-width: 480px) {
            width: 95vw;
            max-width: 320px;
            padding: 1rem;
          }
        `;
    }
  }}
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
