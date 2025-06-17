import styled from 'styled-components';
export const StyledRadioButton = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  background-color: transparent;
  &:checked {
    background-color: #007bff;
    border-color: #007bff;
  }
  &:checked::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.2);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  &:disabled + label {
    color: #999;
  }
`;
export const StyledRadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  ${StyledRadioButton} {
    margin-right: 8px;
  }
`;
export const StyledRadioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  ${StyledRadioLabel} {
    margin-left: 8px;
  }
`;
export const StyledRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  ${StyledRadioContainer} {
    margin-bottom: 0;
  }
`;
export const StyledRadioError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

// Usage example:
// <StyledRadioGroup>
//   <StyledRadioContainer>
//     <StyledRadioButton id="option1" name="group1" value="option1" />
//     <StyledRadioLabel htmlFor="option1">Option 1</StyledRadioLabel>
//   </StyledRadioContainer>
//   <StyledRadioContainer>
//     <StyledRadioButton id="option2" name="group1" value="option  2" />
//     <StyledRadioLabel htmlFor="option2">Option 2</StyledRadioLabel>
//   </StyledRadioContainer>
//   <StyledRadioError>Selection is required</StyledRadioError>
// </StyledRadioGroup>
