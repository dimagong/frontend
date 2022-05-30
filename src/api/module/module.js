import instance from "api";
import { modulesPath } from "constants/onboarding";

const moduleApi = {
  async getModules() {
    try {
      const result = await instance({
        url: modulesPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
};

export default moduleApi;
