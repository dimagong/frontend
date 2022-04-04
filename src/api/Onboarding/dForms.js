import instance, { requestLayout, } from "api";
import {
  dFormActionsPath,
  dFormTriggersPath,
  submitdFormDataPath,
  changedFormStatusPath,
  submitdFormPath,
  surveyTriggersPath,
  updateDFormFromParent,
  submitdFormNewVersionPath
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
    }
  },
  async submitdFormNewVersion({dForm, data}) {

    return await requestLayout(submitdFormNewVersionPath(dForm.id), "PUT", data);
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
    }
  },
  async getSurveyTriggers() {
    try {
      const result = await instance({
        url: surveyTriggersPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
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
      throw err.response.data.error.errors;
    }
  },
  async updateViewedSections(id, isViewedSectionsList) {
    try {
      const result = await instance({
        url: `api/dform/${id}/viewed-sections`,
        method: "PUT",
        data: {
          is_viewed_sections: isViewedSectionsList
        }
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
};

export default dFormApi;
