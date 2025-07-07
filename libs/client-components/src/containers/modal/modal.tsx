import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTransition, animated } from 'react-spring';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  StyledModalContainer,
  StyledModalContent,
  StyledModalHeader,
  StyledModalTitle,
} from './styled-model';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  // Animation transitions for backdrop
  const backdropTransition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 200 },
  });

  // Animation transitions for modal content
  const modalTransition = useTransition(isOpen, {
    from: { opacity: 0, transform: 'scale(0.8) translateY(-20px)' },
    enter: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    leave: { opacity: 0, transform: 'scale(0.8) translateY(-20px)' },
    config: { tension: 300, friction: 25 },
  });

  // Handle escape key press
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalContent = backdropTransition(
    (backdropStyles, item) =>
      item && (
        <animated.div style={backdropStyles}>
          <StyledModalContainer
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {modalTransition(
              (modalStyles, modalItem) =>
                modalItem && (
                  <animated.div style={modalStyles}>
                    <StyledModalContent
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      {(title || showCloseButton) && (
                        <StyledModalHeader>
                          {title && (
                            <StyledModalTitle id="modal-title">
                              {title}
                            </StyledModalTitle>
                          )}
                          {showCloseButton && (
                            <IconButton
                              onClick={onClose}
                              size="small"
                              aria-label="close modal"
                            >
                              <CloseIcon />
                            </IconButton>
                          )}
                        </StyledModalHeader>
                      )}
                      {children}
                    </StyledModalContent>
                  </animated.div>
                )
            )}
          </StyledModalContainer>
        </animated.div>
      )
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
