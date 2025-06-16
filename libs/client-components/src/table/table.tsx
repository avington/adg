import React, { ReactNode } from 'react';
import styled from 'styled-components';

// Styled components
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const StyledThead = styled.thead`
  background: var(--color-blue-100);
`;

const StyledHeaderRow = styled.tr``;

const StyledHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--color-blue-grey-100);
`;

const StyledBodyRow = styled.tr`
  &:nth-child(even) {
    background: var(--color-light-blue-50);
  }
`;

const StyledCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
`;

// Component definitions
export const TableHeader: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <StyledThead>
    <StyledHeaderRow>{children}</StyledHeaderRow>
  </StyledThead>
);

export const TableHeaderCell: React.FC<{ children: ReactNode }> = ({
  children,
}) => <StyledHeaderCell>{children}</StyledHeaderCell>;

export const TableRow: React.FC<{ children: ReactNode }> = ({ children }) => (
  <StyledBodyRow>{children}</StyledBodyRow>
);

export const TableCell: React.FC<{ children: ReactNode }> = ({ children }) => (
  <StyledCell>{children}</StyledCell>
);

export const Table: React.FC<{ children: ReactNode }> = ({ children }) => (
  <StyledTable>{children}</StyledTable>
);

/**
 * Example usage:
 *
 * <Table>
 *   <TableHeader>
 *     <TableHeaderCell>Name</TableHeaderCell>
 *     <TableHeaderCell>Email</TableHeaderCell>
 *     <TableHeaderCell>Role</TableHeaderCell>
 *   </TableHeader>
 *   <tbody>
 *     <TableRow>
 *       <TableCell>Alice</TableCell>
 *       <TableCell>alice@example.com</TableCell>
 *       <TableCell>Admin</TableCell>
 *     </TableRow>
 *     <TableRow>
 *       <TableCell>Bob</TableCell>
 *       <TableCell>bob@example.com</TableCell>
 *       <TableCell>User</TableCell>
 *     </TableRow>
 *   </tbody>
 * </Table>
 */
