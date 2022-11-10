import { DformFieldTypes } from "./models";

export const normalizedDFormValueByField = (field: any, dformValue: any): any => {
  switch (field.type) {
    case DformFieldTypes.Text:
    case DformFieldTypes.Date:
    case DformFieldTypes.Number:
    case DformFieldTypes.TextArea:
    case DformFieldTypes.LongText:
      return dformValue.value ?? "";
    case DformFieldTypes.Boolean:
      return dformValue.value ?? null;
    case DformFieldTypes.Select:
      return dformValue.value ?? null;
    case DformFieldTypes.MultiSelect:
      return Array.isArray(dformValue.value) ? dformValue.value : [];
    case DformFieldTypes.File:
    case DformFieldTypes.FileList:
      return Array.isArray(dformValue.files) ? dformValue.files : [];
    case DformFieldTypes.Resource:
      return Array.isArray(dformValue.files) ? dformValue.files[0] : null;
    default:
      throw new Error(`Unexpected field type: ${field.type}`);
  }
};
