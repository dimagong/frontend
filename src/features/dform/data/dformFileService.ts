import { clientAPI } from "api/clientAPI";
import { invariant } from "features/common";
import { clientFetch } from "api/clientFetch";

import type { DFormFiles } from "../types";

export type TemporaryFileResponse = { name: string; temporary_public_url: string };

export class DformFileService {
  // Temporary solution while there is no DI.
  static #instance: { member?: DformFileService; manager?: DformFileService } = {};
  static get member(): DformFileService {
    if (!DformFileService.#instance.member) {
      DformFileService.#instance.member = new DformFileService(clientAPI, clientFetch, "/member-view-api");
    }
    return DformFileService.#instance.member;
  }
  static get manager(): DformFileService {
    if (!DformFileService.#instance.manager) {
      DformFileService.#instance.manager = new DformFileService(clientAPI, clientFetch, "/api");
    }
    return DformFileService.#instance.manager;
  }

  private constructor(
    private apiClient: typeof clientAPI,
    private httpClient: typeof clientFetch,
    private baseUrl: string
  ) {}

  buildUrl(url: string) {
    return `${this.baseUrl}${url}`;
  }

  get(params: { masterSchemaFieldId: number; dformId: number; fileId: number }) {
    const { masterSchemaFieldId, dformId, fileId } = params;

    const searchParams = new URLSearchParams({
      file_id: String(fileId),
      master_schema_field_id: String(masterSchemaFieldId),
    });
    const url = this.buildUrl(`/dform/${dformId}/user-file-download?${searchParams}`);

    return this.apiClient.get(url).then((response?: TemporaryFileResponse) => {
      invariant(response, "Got an undefined response for a file requesting.");

      return this.httpClient(response.temporary_public_url)
        .then((response) => response.blob())
        .then((blob) => new File([blob], response.name, { type: blob.type }));
    });
  }

  post(params: { masterSchemaFieldId: number; dformId: number; files: File[] }): Promise<DFormFiles> {
    const formData = new FormData();
    const { masterSchemaFieldId, dformId, files } = params;

    formData.append("master_schema_field_id", String(masterSchemaFieldId));
    files.forEach((file, index) => formData.append(`files[${index}]`, file, file.name));

    const url = this.buildUrl(`/dform/${dformId}/user-files`);

    return this.apiClient.post(url.toString(), formData);
  }

  delete(params: { masterSchemaFieldId: number; dformId: number; fileId: number }): Promise<void> {
    const { masterSchemaFieldId, dformId, fileId } = params;

    const url = this.buildUrl(`/dform/${dformId}/user-file`);
    const data = { master_schema_field_id: masterSchemaFieldId, file_id: fileId };

    return this.apiClient.delete(url.toString(), data);
  }
}
