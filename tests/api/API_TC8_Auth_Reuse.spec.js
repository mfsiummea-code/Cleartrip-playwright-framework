import { test, expect } from '../../fixtures/authFixture';

test.describe('Auth state reuse', () => {
  test('Login with the stored credentials returns a token', async ({ playwright }) => {
    const api = await playwright.request.newContext();
    const response = await api.post(process.env.REQRES_LOGIN_URL, {
      data: {
        email: process.env.REQRES_EMAIL,
        password: process.env.REQRES_PASSWORD,
      },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body).not.toHaveProperty('error');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('Stored token is attached and sent to a bearer-protected endpoint', async ({ request }) => {
    const response = await request.get('https://httpbin.org/bearer');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.authenticated).toBe(true);
    expect(body.token).toBe(process.env.AUTH_TOKEN);
  });

  test('Request without the stored token is rejected', async ({ playwright }) => {
    const anonymous = await playwright.request.newContext();
    const response = await anonymous.get('https://httpbin.org/bearer');
    expect(response.status()).toBe(401);
    await anonymous.dispose();
  });
});