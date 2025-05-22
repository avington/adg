import { StyledNav } from './styled-nav';
import { AuthenticationStatusButton } from '@adg/client-auth';

export const DefaultNav = () => {
  return (
    <StyledNav>
      <ul>
        <li>
          <AuthenticationStatusButton />
        </li>
      </ul>
    </StyledNav>
  );
};
