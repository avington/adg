import { render } from '@testing-library/react';

import AllHoldingsEarningsPanel from './all-holdings-earnings-panel';

describe('AllHoldingsEarningsPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AllHoldingsEarningsPanel />);
    expect(baseElement).toBeTruthy();
  });
});
