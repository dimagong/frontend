import instance from "api";
import { dFormPath,dFormActionsPath,dFormTriggersPath } from "constants/onboarding";

const dFormApi = {
  async getdForms() {
    try {
      const result = await instance({
        url: dFormPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async createdForm(data) {
    try {
      const result = await instance({
        url: dFormPath,
        method: "POST",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async updatedForm(data) {
    try {
      const result = await instance({
        url: `${dFormPath}/${data.id}`,
        method: "PUT",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async deletedForm(data) {
    try {
      const result = await instance({
        url: `${dFormPath}/${data.id}`,
        method: "DELETE",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getdFormActions() {
    try {
      const result = await instance({
        url: dFormActionsPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getdFormTriggers() {
    try {
      const result = await instance({
        url: dFormTriggersPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};

export default dFormApi;
