import { searchSymbol, getQuote } from './server-shared-fmp';

describe('serverSharedFmp', () => {
  it('should have searchSymbol and getQuote functions', () => {
    expect(typeof searchSymbol).toBe('function');
    expect(typeof getQuote).toBe('function');
  });
});
