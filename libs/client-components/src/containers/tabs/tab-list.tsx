import styled from 'styled-components';

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: string;
}

export const TabList = styled.div<TabListProps>`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 24px;
  width: fit-content;
`;
