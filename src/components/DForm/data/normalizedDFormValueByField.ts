import { FieldTypes } from "../types/fieldTypes";
import { DFormValue } from "../types/dformValue";
import { NormalizedDFormValue } from "../types/normalizedDFormValue";

type Field = {
  type: FieldTypes;
  helpTextValue: string;
};

export const normalizedDFormValueByField = (field: Field, dformValue: DFormValue): NormalizedDFormValue => {
  switch (field.type) {
    case FieldTypes.Text:
    case FieldTypes.Date:
    case FieldTypes.Number:
    case FieldTypes.TextArea:
    case FieldTypes.LongText:
      return dformValue.value ?? "";
    case FieldTypes.Boolean:
      return dformValue.value ?? null;
    case FieldTypes.Select:
      return dformValue.value ?? null;
    case FieldTypes.MultiSelect:
      return Array.isArray(dformValue.value) ? dformValue.value : [];
    case FieldTypes.File:
    case FieldTypes.FileList:
      return Array.isArray(dformValue.files) ? dformValue.files : [];
    case FieldTypes.Resource:
      return Array.isArray(dformValue.files) ? dformValue.files[0] : null;
    default:
      throw new Error(`Unexpected field type: ${field.type}`);
  }
};
