import { render } from '@testing-library/react';

import GlobalModels from './global-models';

describe('GlobalModels', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GlobalModels />);
    expect(baseElement).toBeTruthy();
  });
});
