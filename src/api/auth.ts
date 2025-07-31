import BaseApi from "./baseapi";

class AuthApi extends BaseApi {
  baseUrl: string = "auth";
  constructor() {
    super();
  }

  async login(email: string, password: string) {
    const data = await this.post(`${this.baseUrl}/signin`, {
      email,
      password,
    });
    return data;
  }

  async changePassword(body: any, config?: any) {
    return await this.patch(`${this.baseUrl}/change-password`, body, config);
  }
}

export const authApi = new AuthApi();
export default authApi;
