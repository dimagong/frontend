import instance from "api";
import {
  dFormActionsPath,
  dFormTriggersPath,
  submitdFormDataPath,
  changedFormStatusPath,
  submitdFormPath,
  updateDFormFromParent
} from "constants/onboarding";
import {dFormPath, dFormTemplatePath} from "../../constants/onboarding";

const dFormApi = {
  async getdForms() {
    try {
      const result = await instance({
        url: dFormTemplatePath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async submitdFormData({dForm, data}) {
    try {
      const result = await instance({
        url: submitdFormDataPath(dForm.id),
        method: "PUT",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async submitdForm({dForm, data}) {
    try {
      const result = await instance({
        url: submitdFormPath(dForm.id),
        method: "PUT",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async changedFormStatus({dForm, status}) {
    try {
      const result = await instance({
        url: changedFormStatusPath(dForm.id),
        method: "PUT",
        data: {status}
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async createDFormTemplate(data) {
    try {
      const result = await instance({
        url: dFormTemplatePath,
        method: "POST",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async updateDForm(data) {
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
  async updateDFormTemplate(data) {
    try {
      const result = await instance({
        url: `${dFormTemplatePath}/${data.id}`,
        method: "PUT",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async deleteDFormTemplate(data) {
    try {
      const result = await instance({
        url: `${dFormTemplatePath}/${data.id}`,
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
  async updateDFormFromParent({id}) {
    try {
      const result = await instance({
        url: updateDFormFromParent(id),
        method: "PUT",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};

export default dFormApi;
