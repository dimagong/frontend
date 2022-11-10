import { getFieldsBySectionId } from "./getFieldsBySectionId";

export const getValuesBySectionId = (sectionId: string, schema: any, values: any): any => {
  const fields = getFieldsBySectionId(sectionId, schema);
  return Object.fromEntries(
    Object.entries(values).filter(([id]) => {
      return fields.find(({ masterSchemaFieldId }) => masterSchemaFieldId === Number(id)) !== null;
    })
  );
};
