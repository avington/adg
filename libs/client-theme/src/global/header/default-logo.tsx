import React from 'react';
import { StyledLogo } from './styled-logo';

export const DefaultLogo: React.FC = () => {
  return (
    <StyledLogo>
      <img
        src="/logo.png"
        alt="Logo"
        style={{ width: '100px', height: '50px', objectFit: 'cover' }}
      />
    </StyledLogo>
  );
};

export default DefaultLogo;
