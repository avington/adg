import { render } from '@testing-library/react';

import AuthenticationProvider from './authentication-provider';

describe('AuthenticationProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthenticationProvider />);
    expect(baseElement).toBeTruthy();
  });
});
