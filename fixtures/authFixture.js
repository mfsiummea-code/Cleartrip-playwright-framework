import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  request: async ({ playwright }, use) => {
    const token = process.env.AUTH_TOKEN;

    if (!token) {
      throw new Error(
        'AUTH_TOKEN is not set. Global setup must run first and log in successfully.'
      );
    }

    const context = await playwright.request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    await use(context);
    await context.dispose();
  },
});

export { expect };