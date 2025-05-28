import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const UserProfileMenuStyled = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #e0e0e0;
  }
  & > .user-profile-menu-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
  }
  &:hover > .user-profile-menu-content {
    display: block;
  }
`;

export const UserProfileMenu: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <UserProfileMenuStyled>
      {children}
      <div className="user-profile-menu-content">
        {/* User profile menu content goes here */}
        <p>User Profile</p>
        <p>Settings</p>
        <p>Logout</p>
      </div>
    </UserProfileMenuStyled>
  );
};
