import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSpring, animated, to as springTo } from 'react-spring';
import MenuIcon from '@mui/icons-material/Menu';

type MenuItem = {
  title: string;
  onClick: () => void;
};

type MenuButtonProps = {
  items: MenuItem[];
};

const StyledMenuButton = styled(
  React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >((props, ref) => (
    <button ref={ref} {...props}>
      {props.children}
    </button>
  ))
)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--color-blue-grey-700);
  display: flex;
  align-items: center;
`;

const DropdownPortal = styled(animated.div)`
  position: fixed;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
`;

const MenuItemStyled = styled.div<{ onClick?: () => void }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f5f5f5;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const MenuButton: React.FC<MenuButtonProps> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dropdownAnimation = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0px)' : 'translateY(-10px)',
    pointerEvents: open ? 'auto' : 'none',
    config: { tension: 300, friction: 24 },
  });

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 160 + window.scrollX, // Align right edge
      });
    }
  }, [open]);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleItemClick = (cb: () => void) => {
    cb();
    setOpen(false);
  };

  return (
    <Wrapper>
      <StyledMenuButton
        ref={buttonRef}
        aria-label="menu"
        onClick={handleToggle}
      >
        <MenuIcon fontSize="large" />
      </StyledMenuButton>
      {open &&
        createPortal(
          <DropdownPortal
            style={{
              opacity: dropdownAnimation.opacity,
              transform: dropdownAnimation.transform,
              pointerEvents: springTo(
                dropdownAnimation.pointerEvents,
                (v) => v as string
              ),
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            {items.map((item, idx) => (
              <MenuItemStyled
                key={idx}
                onClick={() => handleItemClick(item.onClick)}
                as="div"
              >
                {item.title}
              </MenuItemStyled>
            ))}
          </DropdownPortal>,
          document.body
        )}
    </Wrapper>
  );
};
