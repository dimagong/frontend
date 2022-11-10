import { DformFieldValueType } from "./models";
import { normalizedDFormValueByField } from "./normalizedDFormValueByField";
import { getFieldByMasterSchemaFieldId } from "./getFieldByMasterSchemaFieldId";

export const normalizeValues = (
  values: Record<string, unknown>,
  schema: unknown
): Record<string, DformFieldValueType> => {
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
