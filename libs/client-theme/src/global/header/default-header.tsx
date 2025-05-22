import { DefaultLogo } from './default-logo';
import { DefaultNav } from './default-nav';
import { StyledHeader } from './styled-header';

export const DefaultHeader: React.FC = () => {
  return (
    <StyledHeader>
      <DefaultLogo />
      <DefaultNav />
    </StyledHeader>
  );
};
