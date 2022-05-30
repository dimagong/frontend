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
};

export default organizationApi;
