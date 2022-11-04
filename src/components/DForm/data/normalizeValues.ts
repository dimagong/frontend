import { DFormSchema } from "../types/dformSchema";
import { DFormValues } from "../types/dformValues";
import { NormalizedDFormValues } from "../types/normalizedDFormValues";

import { getFieldByMasterSchemaFieldId } from "./getFieldByMasterSchemaFieldId";
import { normalizedDFormValueByField } from "./normalizedDFormValueByField";

export const normalizeValues = (values: DFormValues, schema: DFormSchema): NormalizedDFormValues => {
  return Object.fromEntries(
    Object.entries(values)
      .map(([id, dformValue]) => {
        const field = getFieldByMasterSchemaFieldId(id, schema);
        return { id, dformValue, field };
      })
      .filter(({ field }) => field !== undefined)
      .map(({ id, dformValue, field }) => {
        const normalizedValue = normalizedDFormValueByField(field, dformValue);

        return [id, normalizedValue];
      })
  );
};