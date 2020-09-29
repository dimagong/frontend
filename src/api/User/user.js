import instance from "api";
import { getProfilePath, getUsersPath } from "constants/user";

const userApi = {
  async getProfile() {
    try {
      const result = await instance({
        url: getProfilePath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getUsers() {
    try {
      const result = await instance({
        url: "/api/user/getByEmail",
        method: "GET",
        params: {
          page: 1,
          email: ""

        }
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};

export default userApi;
