import { requestLayout } from "api";

import {
  getResourceManagersListUrl,
  getResourceManagerHierarchy,
  createFieldInResourceManagerHierarchy,
  createFolderInResourceManagerHierarchy,
  getResourcePreviousVersions,
} from './contants'

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
};

export default resourceManagerApi;
