import { FieldTypes } from "../types/fieldTypes";
import { DFormSchema } from "../types/dformSchema";

export const getFieldByMasterSchemaFieldId = (masterSchemaFieldId: string | number, schema: DFormSchema) => {
  return Object.values(schema.fields)
    .filter(({ type }) => type !== FieldTypes.HelpText)
    .find((field) => Number(field.masterSchemaFieldId) === Number(masterSchemaFieldId));
};
