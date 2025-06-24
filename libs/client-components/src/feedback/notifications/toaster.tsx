import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSpring, animated } from '@react-spring/web';
import styled from 'styled-components';
import { ToasterMode } from './toaster-context';

interface ToasterProps {
  show: boolean;
  message: string;
  mode?: ToasterMode;
  duration?: number;
  onClose: () => void;
}

const ToasterContainer = styled(animated.div)<{ mode: ToasterMode }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${({ mode }) => {
    switch (mode) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
      default:
        return '#3b82f6';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px 8px 0 0;
  }
`;

const ToasterIcon = styled.span<{ mode: ToasterMode }>`
  display: inline-block;
  margin-right: 8px;
  font-size: 16px;

  &::before {
    content: ${({ mode }) => {
      switch (mode) {
        case 'success':
          return '"✓"';
        case 'error':
          return '"✕"';
        case 'warning':
          return '"⚠"';
        case 'info':
        default:
          return '"ℹ"';
      }
    }};
  }
`;

const ToasterMessage = styled.span`
  display: inline-block;
  word-wrap: break-word;
`;

export const Toaster: React.FC<ToasterProps> = ({
  show,
  message,
  mode = 'info',
  duration = 5000,
  onClose,
}) => {
  const springProps = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? 'translateX(0px)' : 'translateX(400px)',
    config: {
      tension: 300,
      friction: 20,
    },
  });
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, duration, onClose]);

  if (!show && springProps.opacity.get() === 0) {
    return null;
  }

  return createPortal(
    <ToasterContainer
      style={springProps}
      mode={mode}
      onClick={onClose}
      role="alert"
      aria-live="polite"
    >
      <ToasterIcon mode={mode} />
      <ToasterMessage>{message}</ToasterMessage>
    </ToasterContainer>,
    document.body
  );
};
