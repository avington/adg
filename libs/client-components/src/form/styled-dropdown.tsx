import styled from 'styled-components';

export const StyledDropdown = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-blue-grey-200);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-blue-grey-900);
  background-color: var(--color-white);
  appearance: none; /* Removes default dropdown arrow */

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
export const StyledDropdownLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--color-blue-grey-800);
`;
export const StyledDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  ${StyledDropdownLabel} {
    margin-bottom: 4px;
  }
`;
export const StyledDropdownError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;
export const StyledDropdownGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;

  ${StyledDropdownContainer} {
    margin-bottom: 0;
  }
`;
export const StyledDropdownOption = styled.option`
  padding: 8px 12px;
  font-size: 14px;
  color: var(--color-blue-grey-900);
  background-color: var(--color-white);

  &:hover {
    background-color: var(--color-light-blue-50);
  }
`;
// Usage example:
// <StyledDropdownContainer>
//   <StyledDropdownLabel htmlFor="exampleDropdown">Select an option</StyledDropdownLabel>
//   <StyledDropdown id="exampleDropdown">
//     <StyledDropdownOption value="" disabled selected>Select...</StyledDropdownOption>
//     <StyledDropdownOption value="option1">Option 1</StyledDropdownOption>
//     <StyledDropdownOption value="option2">Option 2</StyledDropdownOption>
//     <StyledDropdownOption value="option3">Option 3</StyledDropdownOption>
//   </StyledDropdown>
//   <StyledDropdownError>Error message here</StyledDropdownError>
// </StyledDropdownContainer>
// <StyledDropdownGroup>
//   <StyledDropdownContainer>
//     <StyledDropdownLabel htmlFor="groupDropdown">Group Dropdown</StyledDropdownLabel>
//     <StyledDropdown id="groupDropdown">
//       <StyledDropdownOption value="" disabled selected>Select...</StyledDropdownOption>
//       <StyledDropdownOption value="group1">Group 1</StyledDropdownOption>
//       <StyledDropdownOption value="group2">Group 2</StyledDropdownOption>
//       <StyledDropdownOption value="group3">Group 3</StyledDropdownOption>
//     </StyledDropdown>
//     <StyledDropdownError>Error message here</StyledDropdownError>
//   </StyledDropdownContainer>
//   <StyledDropdownContainer>
//     <StyledDropdownLabel htmlFor="anotherDropdown">Another Dropdown</StyledDropdownLabel>
//     <StyledDropdown id="anotherDropdown">
//       <StyledDropdownOption value="" disabled selected>Select...</StyledDropdownOption>
//       <StyledDropdownOption value="another1">Another 1</StyledDropdownOption>
//       <StyledDropdownOption value="another2">Another 2</StyledDropdownOption>
//       <StyledDropdownOption value="another3">Another 3</StyledDropdownOption>
//     </StyledDropdown>
//     <StyledDropdownError>Error message here</StyledDropdownError>
//   </StyledDropdownContainer>
// </StyledDropdownGroup>
//   </StyledRadioContainer>
//     <StyledRadioLabel htmlFor="option2">Option 2</StyledRadioLabel>
//   </StyledRadioContainer>
// </StyledRadioGroup>
