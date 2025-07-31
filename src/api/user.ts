import BaseApi from "./baseapi";

class UserApi extends BaseApi {
  baseUrl: string = "user";
  constructor() {
    super();
  }

  async updatedUser(id: string, body: any, config?: any) {
    return await this.patch(`${this.baseUrl}/${id}`, body, config);
  }
}

export const userApi = new UserApi();
export default userApi;
