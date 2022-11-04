import type { DFormSchema } from "../types";
import { FieldTypes } from "../types/fieldTypes";

export const getFieldByMasterSchemaFieldId = (masterSchemaFieldId: string | number, schema: DFormSchema) => {
  return Object.values(schema.fields)
    .filter(({ type }) => type !== FieldTypes.HelpText)
    .find((field) => Number(field.masterSchemaFieldId) === Number(masterSchemaFieldId));
};
