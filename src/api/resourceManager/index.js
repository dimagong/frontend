import { requestLayout } from "api";

import * as Urls from './contants'

const resourceManagerApi = {
  async getResourceManagersList() {
    return await requestLayout(Urls.getResourceManagersListUrl, "GET");
  },

  async getResourceManagerHierarchy({ payload }) {
    return await requestLayout(Urls.getResourceManagerHierarchy(payload), "GET");
  },

  async createResourceManagerField({ payload }) {
    return await requestLayout(Urls.createFieldInResourceManagerHierarchy, "POST", payload)
  },

  async createResourceManagerGroup({ payload }) {
    return await requestLayout(Urls.createFolderInResourceManagerHierarchy, "POST", payload)
  },

  async getResourcePreviousVersions({ payload }) {
    return await requestLayout(Urls.getResourcePreviousVersions(payload), "GET")
  },

  async uploadResource({ payload }) {
    return await requestLayout(Urls.uploadResourceUrl, "POST", payload)
  },

  async removeResource(fileId) {
    return await requestLayout(Urls.removeResourceTemplateUrl(fileId), "DELETE")
  },
};

export default resourceManagerApi;
