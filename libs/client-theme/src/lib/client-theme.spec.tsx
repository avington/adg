import { render } from '@testing-library/react';

import ClientTheme from './client-theme';

describe('ClientTheme', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientTheme />);
    expect(baseElement).toBeTruthy();
  });
});
