import { get, pipe } from "lodash/fp";

import instance from "api";
import { downloadBlob } from "services/files.service";

import { endEditField, postEditField } from "./contants";

const flatResponseData = get("data.data");
const flatResponseError = pipe(get("response.data.error"), (e) => Promise.reject(e));

export const ResourceManagerPreviousVersionService = {
  editVersion({ versionId }) {
    return instance({
      method: "POST",
      url: postEditField(versionId),
    })
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
    return instance({
      method: "POST",
      url: endEditField(versionId),
    }).then(flatResponseData, flatResponseError);
  },

  downloadVersion({ versionId, name }) {
    instance({
      url: `api/resource-manager-field-file/${versionId}/download`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      downloadBlob(response.data, name)
    });
  }
};
