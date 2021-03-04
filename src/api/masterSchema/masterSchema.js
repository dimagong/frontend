import instance from "api";
import { masterSchemaOrganizations } from "constants/masterSchema";

const masterSchemaApi = {
  async getOrganizationsMasterSchema() {
    try {
      const result = await instance({
        url: masterSchemaOrganizations,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

};

export default masterSchemaApi;
