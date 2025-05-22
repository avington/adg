import { serverAuth } from './server-auth';

describe('serverAuth', () => {
  it('should work', () => {
    expect(serverAuth()).toEqual('server-auth');
  });
});
