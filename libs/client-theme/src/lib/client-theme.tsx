import { PropsWithChildren } from 'react';
import { BodyContainer } from '../global/body-container';

export const ClientTheme: React.FC<PropsWithChildren> = ({ children }) => {
  return <BodyContainer>{children}</BodyContainer>;
};

export default ClientTheme;
