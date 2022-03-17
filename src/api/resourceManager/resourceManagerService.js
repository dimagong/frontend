import _ from "lodash/fp";

import api from "api";
import { downloadBlob } from "services/files.service";

import * as Urls from "./contants";
import { normalizeHierarchy } from "../masterSchema/normalizers";

const flatResponseData = _.get("data.data");
const flatResponseError = _.pipe(_.get("response.data.error"), (e) => Promise.reject(e));

export const resourceManagerService = {
  getAll() {
    return api.get(Urls.getResourceManagersListUrl).then(flatResponseData, flatResponseError);
  },

  getHierarchy({ resourceManagerId }) {
    return api
      .get(Urls.getResourceManagerHierarchy(resourceManagerId))
      .then(flatResponseData, flatResponseError)
      .then((hierarchy) => (hierarchy ? normalizeHierarchy(hierarchy) : hierarchy));
  },

  createField({ name, parentId, resourceManagerId }) {
    return api.post(Urls.createFieldInResourceManagerHierarchy, {
      name,
      resource_manager_directory_id: parentId,
      provided_by: resourceManagerId,
    });
  },

  createGroup({ name, parentId, resourceManagerId }) {
    return api.post(Urls.createFolderInResourceManagerHierarchy, {
      name,
      parent_id: parentId,
      resource_manager_id: resourceManagerId,
    });
  },

  getVersions({ fieldId }) {
    return api.get(Urls.getResourcePreviousVersions(fieldId)).then(flatResponseData, flatResponseError);
  },

  uploadResource(formData) {
    return api.post(Urls.uploadResourceUrl, formData);
  },

  removeResource({ versionId }) {
    return api.delete(Urls.removeResourceTemplateUrl(versionId));
  },

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
      .then((response) => downloadBlob(response.data, name));
  },
};
