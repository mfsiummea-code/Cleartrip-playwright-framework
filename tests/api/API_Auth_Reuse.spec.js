import { test, expect } from '../../fixtures/authFixture';

test.describe('Auth state reuse', () => {
  test('Authenticated context attaches stored token to every request', async ({ request }) => {
    const response = await request.get('https://httpbin.org/headers');
    const body = await response.json();

    expect(body.headers.Authorization).toContain('Bearer');
    console.log('Headers the server received:', body.headers);
  });
});