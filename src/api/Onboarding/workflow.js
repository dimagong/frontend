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
      throw err;
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
      throw err;
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
      throw err;
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
      throw err;
    }
  },

};

export default workflowApi;
