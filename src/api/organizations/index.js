import { Buffer } from "buffer";

import instance from "api";

const organizationApi = {
  async getOrganizations() {
    try {
      const result = await instance({
        url: "api/organization",
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

  async createOrganization(data) {
    try {
      const result = await instance({
        url: "api/organization",
        method: "POST",
        data,
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

  async updateOrganization(data) {
    try {
      data.append("_method", "PUT");
      const result = await instance({
        url: "api/organization",
        method: "POST",
        data,
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

  async getOrganizationLogo(org) {
    try {
      const result = await instance({
        url: "api/file/" + org.logo.id,
        method: "GET",
        responseType: "arraybuffer",
      });
      const base64 = new Buffer(result.data, "binary").toString("base64");

      return `data:${org.logo.mime_type};base64, ${base64}`;
    } catch (err) {
      throw err;
    }
  },
};

export default organizationApi;
