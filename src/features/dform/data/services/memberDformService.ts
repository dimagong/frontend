import { queryClient } from "api/queryClient";
import { MVADFormQueryKeys } from "api/Onboarding/prospectUserQuery";

import { DformService } from "./dformService";
import { AbstractService } from "./abstractService";
import { DformModel } from "../models/dformModel";
import { DformFieldModel, DformFieldTypes, DformFieldValueType, DformId, DformSchemaModel } from "../models";

export class MemberDFormService extends AbstractService {
  readonly prefix = "/member-view-api";

  static instance = new MemberDFormService();

  // need to be sure that there is no invalidation by that key before create another one
  static queryKeys = {
    all: MVADFormQueryKeys.all,
    byId: MVADFormQueryKeys.byId,
    valuesById: MVADFormQueryKeys.valuesById,
  };

  getDform(data: { dformId: DformId }): Promise<{ dform: DformModel; values: Record<number, DformFieldValueType> }> {
    const { dformId } = data;
    const url = this.getUrl(`/dform/${dformId}`);

    return this.apiClient
      .get(url)
      .then(DformService.parseDform)
      .then((dform) => {
        return this.getDformValues(data, dform.schema).then((values) => ({ dform, values }));
      });
  }

  private getDformValues(data: { dformId: DformId }, schema: DformSchemaModel) {
    const { dformId } = data;
    const url = this.getUrl(`/dform/${dformId}/user-values`);

    return this.apiClient.get(url).then((data) => DformService.parseValues(data, schema));
  }

  saveFieldValue(data: { dformId: DformId; field: DformFieldModel; value: DformFieldValueType }) {
    const { dformId, field, value } = data;

    if ([DformFieldTypes.File, DformFieldTypes.FileList].includes(field.fieldType)) {
      return Promise.resolve();
    }

    const url = this.getUrl(`/dform/${dformId}/user-value`);

    return this.apiClient.put(url, { master_schema_field_id: field.masterSchemaFieldId, value });
  }

  submit(data: { dformId: DformId }) {
    const { dformId } = data;
    const url = this.getUrl(`/dform/${dformId}/new-version`);

    return this.apiClient.post(url).then(() => {
      queryClient.invalidateQueries(MemberDFormService.queryKeys.all());
    });
  }
}
