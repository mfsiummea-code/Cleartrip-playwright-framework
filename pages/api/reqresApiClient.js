export class ReqresApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://reqres.in/api';
  }

  // GET /users/:id
  async getUser(userId) {
    return this.request.get(`${this.baseUrl}/users/${userId}`);
  }

  /**
   * POST /users
   * @param {{ name: string, job: string }} payload
   */
  async createUser(payload) {
    return this.request.post(`${this.baseUrl}/users`, { data: payload });
  }

  /**
   * PUT /users/:id
   * @param {{ name: string, job: string }} payload
   */
  async updateUser(userId, payload) {
    return this.request.put(`${this.baseUrl}/users/${userId}`, { data: payload });
  }

  // DELETE /users/:id
  async deleteUser(userId) {
    return this.request.delete(`${this.baseUrl}/users/${userId}`);
  }
}

