import styled from 'styled-components';

export const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #007bff;
    border-color: #007bff;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 8px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;
export const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  ${StyledCheckbox} {
    margin-right: 8px;
  }
`;
export const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  ${StyledCheckboxLabel} {
    margin-left: 8px;
  }
`;
export const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;

  ${StyledCheckboxContainer} {
    margin-bottom: 0;
  }
`;
export const StyledCheckboxError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;
