import instance from "api";
import { groupsPath } from "constants/onboarding";

const groupApi = {
  async getGroups() {
    try {
      const result = await instance({
        url: groupsPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },

};

export default groupApi;
