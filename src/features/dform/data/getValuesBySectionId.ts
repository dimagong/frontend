import type { NormalizedDFormValues, DFormSchema } from "../types";

import { getFieldsBySectionId } from "./getFieldsBySectionId";

export const getValuesBySectionId = (
  sectionId: string,
  schema: DFormSchema,
  values: NormalizedDFormValues
): NormalizedDFormValues => {
  const fields = getFieldsBySectionId(sectionId, schema);
  return Object.fromEntries(
    Object.entries(values).filter(([id]) => {
      return fields.find(({ masterSchemaFieldId }) => masterSchemaFieldId === id) !== null;
    })
  );
};
