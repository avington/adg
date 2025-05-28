import { render } from '@testing-library/react';

import ClientFeaturePortfolio from './client-feature-portfolio';

describe('ClientFeaturePortfolio', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientFeaturePortfolio />);
    expect(baseElement).toBeTruthy();
  });
});
