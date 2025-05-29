import { render } from '@testing-library/react';

import AllHoldingsTotalsPanel from './all-holdings-totals-panel';

describe('AllHoldingsTotalsPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AllHoldingsTotalsPanel />);
    expect(baseElement).toBeTruthy();
  });
});
