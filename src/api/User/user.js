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
        url: getUsersPath,
        method: "GET",
        params: {
          page: 1
        }
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};

export default userApi;
