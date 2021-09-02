import instance, { requestLayout } from "api";
import { workflowPath } from "constants/onboarding";

const workflowApi = {
  async getWorkflows(context) {
    return await requestLayout(workflowPath, "GET", context);
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
