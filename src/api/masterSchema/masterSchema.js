import instance from "api";
import { get, pipe } from "lodash/fp";
import { masterSchemaOrganizations } from "constants/masterSchema";

import * as Urls from "./constants";

const flatResponseData = get("data.data");
const flatResponseError = pipe(get("response.data.error"), (e) => Promise.reject(e));

const masterSchemaApi = {
  async getMasterSchemaOrganizations() {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaOrganizationsUrl,
    }).then(flatResponseData, flatResponseError);
  },

  addField({ name, groupId }) {
    return instance({
      method: "POST",
      url: Urls.postMasterSchemaFieldUrl,
      data: { name, master_schema_group_id: groupId },
    }).then(flatResponseData, flatResponseError);
  },

  addGroup({ name, parentId }) {
    return instance({
      method: "POST",
      url: Urls.postMasterSchemaGroupUrl,
      data: { name, parent_id: parentId },
    }).then(flatResponseData, flatResponseError);
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
      responseType: "blob",
      data,
    });

    return result.data;
  },
};

export default masterSchemaApi;
