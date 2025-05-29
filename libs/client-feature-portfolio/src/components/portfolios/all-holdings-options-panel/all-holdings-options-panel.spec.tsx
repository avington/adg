import { render } from '@testing-library/react';

import AllHoldingsOptionsPanel from './all-holdings-options-panel';

describe('AllHoldingsOptionsPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AllHoldingsOptionsPanel />);
    expect(baseElement).toBeTruthy();
  });
});
