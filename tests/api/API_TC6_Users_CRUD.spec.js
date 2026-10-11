import { test, expect } from '@playwright/test';
import { ReqresApiClient } from '../../pages/api/reqresApiClient';

test.describe('Reqres Users API', () => {
  let api;

  test.beforeEach(async ({ request }) => {
    api = new ReqresApiClient(request);
  });

  test('API GET Request', { tag: '@smoke' }, async () => {
    const response = await api.getUser(2);
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');

    const text = await response.text();
    expect(text).toContain('Weaver');
    console.log(await response.json());
  });

  test('API POST Request', async () => {
    const response = await api.createUser({ name: 'morpheus', job: 'leader' });
    expect(response.status()).toBe(201);

    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');

    const text = await response.text();
    expect(text).toContain('morpheus');

    const created = await response.json();
    console.log(created);

    // Follow-up GET.
    // NOTE: reqres.in is a demo API and does not persist created users,
    // so the new id is not retrievable. On a real backend this would be 200.
    const getResponse = await api.getUser(created.id);
    expect(getResponse.status()).toBe(404);
  });

  test('API PUT Request', async () => {
    const response = await api.updateUser(2, { name: 'morpheus', job: 'leader' });
    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toContain('morpheus');
    console.log(await response.json());

    // Follow-up GET: user 2 should still exist after the update.
    // NOTE: reqres does not persist the update, so this only confirms
    // the user is still retrievable, not that the values changed.
    const getResponse = await api.getUser(2);
    expect(getResponse.status()).toBe(200);
  });

  test('API DELETE Request', async () => {
    const response = await api.deleteUser(2);
    expect(response.status()).toBe(204);

    // reqres does not actually remove seeded users, so user 2 is
    // still returned. On a real backend this would be 404.
    const getResponse = await api.getUser(2);
    expect(getResponse.status()).toBe(200);
  });
});