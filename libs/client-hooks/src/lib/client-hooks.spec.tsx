import { render } from '@testing-library/react';

import ClientHooks from './client-hooks';

describe('ClientHooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientHooks />);
    expect(baseElement).toBeTruthy();
  });
});
