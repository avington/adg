import styled from 'styled-components';

export const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;
export const StyledTextareaLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #333;
`;
