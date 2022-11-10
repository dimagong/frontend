import { invariant } from "features/common";

import { AbstractService } from "./abstractService";
import { DformFileListValueType, DformId } from "../models";

export type TemporaryFileResponse = { name: string; temporary_public_url: string };

export class DformFileService extends AbstractService {
  constructor(readonly prefix: AbstractService["prefix"]) {
    super();
  }

  get(params: { masterSchemaFieldId: number; dformId: DformId; fileId: number }) {
    const { masterSchemaFieldId, dformId, fileId } = params;

    const searchParams = new URLSearchParams({
      file_id: String(fileId),
      master_schema_field_id: String(masterSchemaFieldId),
    });
    const url = this.getUrl(`/dform/${dformId}/user-file-download?${searchParams}`);

    return this.apiClient.get(url).then((response?: TemporaryFileResponse) => {
      invariant(response, "Got an undefined response for a file requesting.");

      return this.httpClient(response.temporary_public_url)
        .then((response) => response.blob())
        .then((blob) => new File([blob], response.name, { type: blob.type }));
    });
  }

  post(params: { masterSchemaFieldId: number; dformId: DformId; files: File[] }): Promise<DformFileListValueType> {
    const formData = new FormData();
    const { masterSchemaFieldId, dformId, files } = params;

    formData.append("master_schema_field_id", String(masterSchemaFieldId));
    files.forEach((file, index) => formData.append(`files[${index}]`, file, file.name));

    const url = this.getUrl(`/dform/${dformId}/user-files`);

    return this.apiClient.post(url.toString(), formData);
  }

  delete(params: { masterSchemaFieldId: number; dformId: DformId; fileId: number }): Promise<void> {
    const { masterSchemaFieldId, dformId, fileId } = params;

    const url = this.getUrl(`/dform/${dformId}/user-file`);
    const data = { master_schema_field_id: masterSchemaFieldId, file_id: fileId };

    return this.apiClient.delete(url.toString(), data);
  }
}
