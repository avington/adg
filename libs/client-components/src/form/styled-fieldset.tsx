import styled from 'styled-components';

export const StyledFieldset = styled.fieldset`
  border: 1px solid var(--color-blue-grey-300);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--color-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  legend {
    font-weight: bold;
    color: var(--color-blue-grey-800);
    padding: 0 8px;
    margin-bottom: 8px;
  }
  &.error {
    border-color: var(--color-red-500);
    background-color: var(--color-red-50);
    legend {
      color: var(--color-red-700);
    }
  }
  &.success {
    border-color: var(--color-green-500);
    background-color: var(--color-green-50);
    legend {
      color: var(--color-green-700);
    }
  }
  &.warning {
    border-color: var(--color-yellow-500);
    background-color: var(--color-yellow-50);
    legend {
      color: var(--color-yellow-700);
    }
  }
  &.info {
    border-color: var(--color-blue-500);
    background-color: var(--color-blue-50);
    legend {
      color: var(--color-blue-700);
    }
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
    legend {
      color: var(--color-blue-grey-500);
    }
  }
  &.hidden {
    display: none;
  }
  &.inline {
    display: inline-block;
    margin-right: 16px;
    margin-bottom: 0;
  }
  &.full-width {
    width: 100%;
  }
  &.half-width {
    width: 50%;
  }
  &.no-padding {
    padding: 0;
  }
  &.no-margin {
    margin: 0;
  }
  &.no-border {
    border: none;
  }
  &.no-background {
    background: none;
  }
  &.no-shadow {
    box-shadow: none;
  }
  &.no-radius {
    border-radius: 0;
  }
  &.no-legend {
    legend {
      display: none;
    }
  }
`;

export const StyledFieldsetLegend = styled.legend`
  font-weight: bold;
  color: var(--color-blue-grey-800);
  padding: 0 8px;
  margin-bottom: 8px;
`;
