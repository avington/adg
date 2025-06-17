import React from 'react';
import styled from 'styled-components';

const StyledDateInputBase = styled.input.attrs({ type: 'date' })`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-blue-grey-200);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-blue-grey-900);
  background-color: var(--color-white);
  appearance: none; /* Removes default date input styling */
  &::-webkit-calendar-picker-indicator {
    background: var(--color-blue-grey-200);
    border-radius: 50%;
    padding: 2px;
  }
  &:focus {
    border-color: var(--color-blue-500);
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.2);
  }
  &::placeholder {
    color: var(--color-blue-grey-400);
    opacity: 1; /* Ensures placeholder is fully opaque */
  }
`;

export const StyledDateInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = (props) => <StyledDateInputBase {...props} />;

export const StyledDateInputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-blue-grey-800);
`;
export const StyledDateInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  ${StyledDateInputLabel} {
    margin-bottom: 4px;
  }
`;
export const StyledDateInputError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;
export const StyledDateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;

  ${StyledDateInputContainer} {
    margin-bottom: 0;
  }
`;
export const StyledDateInputOption = styled.option`
  padding: 8px 12px;
  font-size: 14px;
  color: var(--color-blue-grey-900);
  background-color: var(--color-white);

  &:hover {
    background-color: var(--color-light-blue-50);
  }
`;
// Usage example:
// <StyledDateInputGroup>
//   <StyledDateInputContainer>
//     <StyledDateInputLabel htmlFor="date-input">Select Date</StyledDateInputLabel>
//     <StyledDateInput id="date-input" placeholder="YYYY-MM-DD" />
//   </StyledDateInputContainer>
//   <StyledDateInputError>Date is required</StyledDateInputError>
// </StyledDateInputGroup>
// <StyledDateInputContainer>
//   <StyledDateInputLabel htmlFor="date-input">Select Date</StyledDateInputLabel>
//   <StyledDateInput id="date-input" placeholder="YYYY-MM-DD" />
// </StyledDateInputContainer>
// <StyledDateInputError>Date is required</StyledDateInputError>
// <StyledDateInputGroup>
//   <StyledDateInputContainer>
//     <StyledDateInputLabel htmlFor="date-input">Select Date</StyledDateInputLabel>
//     <StyledDateInput id="date-input" placeholder="YYYY-MM-DD" />
//   </StyledDateInputContainer>
//   <StyledDateInputError>Date is required</StyledDateInputError>
// </StyledDateInputGroup>
// <StyledDateInputContainer>
//   <StyledDateInputLabel htmlFor="date-input">Select Date</StyledDateInputLabel>
//   <StyledDateInput id="date-input" placeholder="YYYY-MM-DD" />
// </StyledDateInputContainer>
// <StyledDateInputError>Date is required</StyledDateInputError>
// <StyledDateInputGroup>
//   <StyledDateInputContainer>
//     <StyledDateInputLabel htmlFor="date-input">Select Date</StyledDateInputLabel>
//     <StyledDateInput id="date-input" placeholder="YYYY-MM-DD" />
//   </StyledDateInputContainer>
//   <StyledDateInputError>Date is required</StyledDateInputError>
// </StyledDateInputGroup>
// <StyledDateInputContainer>
//   <StyledDateInputLabel htmlFor="date-input">Select Date</StyledDateInputLabel>
//   <StyledDateInput id="date-input" placeholder="YYYY-MM-DD" />
// </StyledDateInputContainer>
// <StyledDateInputError>Date is required</StyledDateInputError>
// <StyledDateInputGroup>
//   <StyledDateInputContainer>
//     <StyledDateInputLabel htmlFor="date-input">Select Date</StyledDateInputLabel>
//     <StyledDateInput id="date-input" placeholder="YYYY-MM-DD" />
//   </StyledDateInputContainer>
//   <StyledDateInputError>Date is required</StyledDateInputError>
// </StyledDateInputGroup>
