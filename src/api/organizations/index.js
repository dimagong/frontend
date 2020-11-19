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

};

export default organizationApi;
