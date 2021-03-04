import instance from "api";
import { rolesPath } from "constants/onboarding";

const roleApi = {
  async getRoles() {
    try {
      const result = await instance({
        url: rolesPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

};

export default roleApi;
