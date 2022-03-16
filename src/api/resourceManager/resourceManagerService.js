import _ from "lodash/fp";

import api from "api";
import { downloadBlob } from "services/files.service";

import * as Urls from "./contants";

const flatResponseData = _.get("data.data");
const flatResponseError = _.pipe(_.get("response.data.error"), (e) => Promise.reject(e));

export const resourceManagerService = {
  getResourceManagers() {
    return api.get(Urls.getResourceManagersListUrl).then(flatResponseData, flatResponseError);
  },

  // async getResourceManagerHierarchy({ payload }) {
  //   return await requestLayout(Urls.getResourceManagerHierarchy(payload), "GET");
  // },
  //
  // async createResourceManagerField({ payload }) {
  //   return await requestLayout(Urls.createFieldInResourceManagerHierarchy, "POST", payload)
  // },
  //
  // async createResourceManagerGroup({ payload }) {
  //   return await requestLayout(Urls.createFolderInResourceManagerHierarchy, "POST", payload)
  // },
  //
  // async getResourcePreviousVersions({ payload }) {
  //   return await requestLayout(Urls.getResourcePreviousVersions(payload), "GET")
  // },
  //
  // async uploadResource({ payload }) {
  //   return await requestLayout(Urls.uploadResourceUrl, "POST", payload)
  // },
  //
  // async removeResource(fileId) {
  //   return await requestLayout(Urls.removeResourceTemplateUrl(fileId), "DELETE")
  // },

  editVersion({ versionId }) {
    return api
      .post(Urls.postEditField(versionId))
      .then(flatResponseData, flatResponseError)
      .then((response) => {
        if (response.status === "forbidden") {
          window.open(response.message, "_blank");
        } else {
          window.open(response.google_drive_doc.file.webViewLink, "_blank");
        }
      });
  },

  finishEditVersion({ versionId }) {
    return api.post(Urls.endEditField(versionId)).then(flatResponseData, flatResponseError);
  },

  downloadVersion({ versionId, name }) {
    return api
      .get(`api/resource-manager-field-file/${versionId}/download`, {
        responseType: "blob",
      })
      .then((response) => {
        downloadBlob(response.data, name);
      });
  },
};
