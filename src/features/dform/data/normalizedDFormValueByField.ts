import { DFormValue, DFormFieldTypes, NormalizedDFormValue } from "../types";

type Field = {
  type: DFormFieldTypes;
  helpTextValue: string;
};

export const normalizedDFormValueByField = (field: Field, dformValue: DFormValue): NormalizedDFormValue => {
  switch (field.type) {
    case DFormFieldTypes.Text:
    case DFormFieldTypes.Date:
    case DFormFieldTypes.Number:
    case DFormFieldTypes.TextArea:
    case DFormFieldTypes.LongText:
      return dformValue.value ?? "";
    case DFormFieldTypes.Boolean:
      return dformValue.value ?? null;
    case DFormFieldTypes.Select:
      return dformValue.value ?? null;
    case DFormFieldTypes.MultiSelect:
      return Array.isArray(dformValue.value) ? dformValue.value : [];
    case DFormFieldTypes.File:
    case DFormFieldTypes.FileList:
      return Array.isArray(dformValue.files) ? dformValue.files : [];
    case DFormFieldTypes.Resource:
      return Array.isArray(dformValue.files) ? dformValue.files[0] : null;
    default:
      throw new Error(`Unexpected field type: ${field.type}`);
  }
};
