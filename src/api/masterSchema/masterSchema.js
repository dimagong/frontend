import instance, { requestLayout } from "api";
import { masterSchemaOrganizations } from "constants/masterSchema";

import {
  getMasterSchemaOrganizationsUrl,
} from "./constants";

const masterSchemaApi = {
  async getMasterSchemaOrganizations() {
    return requestLayout(getMasterSchemaOrganizationsUrl, "GET");
  },

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

  // Get master schema data in csv. expects organization_type, organization_id and optional user_id.
  // Returns master schema data for exact user or for whole organization depending on is user_id passed.
  async getMasterSchemaCsv(data) {
    const result = await instance({
      url: "api/master-schema/export",
      method: "POST",
      responseType: 'blob',
      data,
    });

    return result.data;
  },
};

export default masterSchemaApi;
