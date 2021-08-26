import instance from "api";
import { workflowPath } from "constants/onboarding";

const workflowApi = {
  async getWorkflows() {
    try {
      const result = await instance({
        url: workflowPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async createWorkflow(data) {
    try {
      const result = await instance({
        url: workflowPath,
        method: "POST",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async updateWorkflow(data) {
    try {
      const result = await instance({
        url: `${workflowPath}/${data.id}`,
        method: "PUT",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async deleteWorkflow(data) {
    try {
      const result = await instance({
        url: `${workflowPath}/${data.id}`,
        method: "DELETE",
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },

};

export default workflowApi;
