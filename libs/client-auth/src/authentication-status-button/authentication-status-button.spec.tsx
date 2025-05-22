import { render } from '@testing-library/react';
import AuthenticationStatusButton from './authentication-status-button';

describe('AuthenticationStatusButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthenticationStatusButton />);
    expect(baseElement).toBeTruthy();
  });
});
