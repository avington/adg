import { render } from '@testing-library/react';

import AllHoldingsHeader from './all-holdings-header';

describe('AllHoldingsHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AllHoldingsHeader />);
    expect(baseElement).toBeTruthy();
  });
});
