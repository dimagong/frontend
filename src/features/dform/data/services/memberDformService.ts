import {
  MVADFormQueryKeys,
  MVADFormCategoryQueryKeys,
  MVADFormCategoryRegisterQueryKeys,
} from "api/Onboarding/prospectUserQuery";
import { queryClient } from "api/queryClient";
import { AbstractService, APIPrefix } from "features/common";

import {
  DformId,
  DformModel,
  DformBlockId,
  DformFieldModel,
  DformFieldTypes,
  DformSchemaModel,
  DformFieldValueType,
  DformSectionId,
} from "../models";
import { DformService } from "./dformService";

export class MemberDFormService extends AbstractService {
  readonly prefix = APIPrefix.Member;

  static instance = new MemberDFormService();

  // need to be sure that there is no invalidation by that key before create another one
  static queryKeys = {
    all: MVADFormQueryKeys.all,
    byId: MVADFormQueryKeys.byId,
    valuesById: MVADFormQueryKeys.valuesById,
  };

  getDform(data: {
    dformId: DformId;
  }): Promise<{ dform: DformModel; values: Record<DformBlockId, DformFieldValueType> }> {
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

  viewSections(data: { dformId: DformId; viewedSections: DformSectionId[] }) {
    const { dformId, viewedSections } = data;
    const endpoint = this.getUrl(`/dform/${dformId}/viewed-sections`);
    const body = { is_viewed_sections: viewedSections };

    return this.apiClient.put(endpoint, body);
  }

  submit(data: { dformId: DformId }) {
    const { dformId } = data;
    const url = this.getUrl(`/dform/${dformId}/new-version`);

    return this.apiClient.post(url).then(() => {
      queryClient.invalidateQueries(MVADFormQueryKeys.all());
      queryClient.invalidateQueries(MVADFormCategoryQueryKeys.all());
      queryClient.invalidateQueries(MVADFormCategoryRegisterQueryKeys.all());
    });
  }
}
