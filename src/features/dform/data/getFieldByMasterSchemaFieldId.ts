import { DformBlockTypes } from "./models";

export const getFieldByMasterSchemaFieldId = (masterSchemaFieldId: string | number, schema) => {
  return Object.values(schema.fields)
    .filter(({ type }) => type !== DformBlockTypes.HelpText)
    .find((field: any) => Number(field.masterSchemaFieldId) === Number(masterSchemaFieldId));
};
