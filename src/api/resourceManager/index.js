import instance, { requestLayout } from "api";

import {
  getResourceManagersListUrl,
  getResourceManagerHierarchy,
  createFieldInResourceManagerHierarchy,
  createFolderInResourceManagerHierarchy,
  getResourcePreviousVersions,
  uploadResourceUrl,
  removeResourceTemplateUrl,
  postEditField,
  endEditField,
} from './contants'
import {get, pipe} from "lodash/fp";
const flatResponseData = get("data.data");
const flatResponseError = pipe(get("response.data.error"), (e) => Promise.reject(e));

const resourceManagerApi = {
  async getResourceManagersList() {

    return await requestLayout(getResourceManagersListUrl, "GET");
  },

  async getResourceManagerHierarchy({ payload }) {
    return await requestLayout(getResourceManagerHierarchy(payload), "GET");
  },

  async createResourceManagerField({ payload }) {
    return await requestLayout(createFieldInResourceManagerHierarchy, "POST", payload)
  },

  async createResourceManagerGroup({ payload }) {
    return await requestLayout(createFolderInResourceManagerHierarchy, "POST", payload)
  },

  async getResourcePreviousVersions({ payload }) {
    return await requestLayout(getResourcePreviousVersions(payload), "GET")
  },

  async uploadResource({ payload }) {
    return await requestLayout(uploadResourceUrl, "POST", payload)
  },

  async removeResource(fileId) {
    return await requestLayout(removeResourceTemplateUrl(fileId), "DELETE")
  },

  postFieldEdit({ fieldId }) {
    return instance({
      method: "POST",
      url: postEditField(fieldId),
    }).then(flatResponseData, flatResponseError);
  },

  postEndFieldEdit({ fieldId }) {
    return instance({
      method: "POST",
      url: endEditField(fieldId),
    }).then(flatResponseData, flatResponseError);
  },
};

export default resourceManagerApi;
