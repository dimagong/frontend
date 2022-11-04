import { DFormBlockTypes, DFormSchema } from "../types";

export const getFieldByMasterSchemaFieldId = (masterSchemaFieldId: string | number, schema: DFormSchema) => {
  return Object.values(schema.fields)
    .filter(({ type }) => type !== DFormBlockTypes.HelpText)
    .find((field) => Number(field.masterSchemaFieldId) === Number(masterSchemaFieldId));
};
