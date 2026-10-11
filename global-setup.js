import { request } from '@playwright/test';

async function globalSetup() {
  const { REQRES_LOGIN_URL, REQRES_EMAIL, REQRES_PASSWORD } = process.env;

  if (!REQRES_LOGIN_URL || !REQRES_EMAIL || !REQRES_PASSWORD) {
    throw new Error(
      'Missing REQRES_LOGIN_URL, REQRES_EMAIL or REQRES_PASSWORD. Check your .env file.'
    );
  }

  const context = await request.newContext();

  const response = await context.post(REQRES_LOGIN_URL, {
    data: {
      email: REQRES_EMAIL,
      password: REQRES_PASSWORD,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login failed with status ${response.status()}`);
  }

  const { token } = await response.json();

  // Keep the token in memory for this test run only. Nothing is written to disk.
  process.env.AUTH_TOKEN = token;

  await context.dispose();
}

export default globalSetup;