import { test, expect } from '@playwright/test';
import { ReqresApiClient } from '../pages/reqresApiClient';

test.describe('Reqres Users API', () => {
  let api;

  test.beforeEach(async ({ request }) => {
    api = new ReqresApiClient(request);
  });

test('API GET Request', async () => {
  const response = await api.getUser(2);
  expect(response.status()).toBe(200);

  // Header verification
  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const text = await response.text();
  expect(text).toContain('Weaver');
  console.log(await response.json());
});

test('API POST Request', async () => {
  const response = await api.createUser({ name: 'morpheus', job: 'leader' });
  expect(response.status()).toBe(201);

  // Header verification
  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');

  const text = await response.text();
  expect(text).toContain('morpheus');
  console.log(await response.json());
});

  test('API PUT Request', async () => {
    const response = await api.updateUser(2, { name: 'morpheus', job: 'leader' });
    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toContain('morpheus');
    console.log(await response.json());
  });

  test('API DELETE Request', async () => {
    const response = await api.deleteUser(2);
    expect(response.status()).toBe(204);
  });
});


// for POST, PUT, DELETE - get again validation
