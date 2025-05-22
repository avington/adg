import { render } from '@testing-library/react';

import ClientAuth from './client-auth';

describe('ClientAuth', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientAuth />);
    expect(baseElement).toBeTruthy();
  });
});
