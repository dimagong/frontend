import instance from "api";
import { getProfilePath } from "constants/user";

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
};

export default userApi;
