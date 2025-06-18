import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSpring, animated } from 'react-spring';

interface ToasterProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number; // ms
}

const toasterRoot =
  document.getElementById('toaster-root') ||
  (() => {
    const el = document.createElement('div');
    el.id = 'toaster-root';
    document.body.appendChild(el);
    return el;
  })();

export const Toaster: React.FC<ToasterProps> = ({
  show,
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, duration, onClose]);

  const animation = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0px)' : 'translateY(40px)',
    config: { tension: 210, friction: 20 },
  });

  if (!show && animation.opacity.get() === 0) return null;

  return createPortal(
    <animated.div
      style={{
        ...animation,
        position: 'fixed',
        bottom: 40,
        right: 40,
        background: '#333',
        color: '#fff',
        padding: '16px 32px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 9999,
        fontSize: 18,
        pointerEvents: 'auto',
      }}
    >
      {message}
    </animated.div>,
    toasterRoot
  );
};
