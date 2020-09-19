import instance from "api";
import { groupsPath } from "constants/onboarding";

const notificationApi = {
  async getGroups() {
    try {
      const result = await instance({
        url: groupsPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

};

export default notificationApi;
