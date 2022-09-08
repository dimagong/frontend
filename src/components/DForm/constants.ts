export enum ElementTypes {
  Group = "group",
  Field = "field",
  Section = "section",
}

export enum FieldTypes {
  Text = "text",
  Date = "date",
  File = "file",
  Select = "select",
  Number = "number",
  Boolean = "boolean",
  LongText = "longText",
  TextArea = "textArea",
  FileList = "fileList",
  Resource = "resource",
  HelpText = "helpText",
  MultiSelect = "multiSelect",
}

export const FIELD_TYPES = {
  [FieldTypes.Text]: FieldTypes.Text,
  [FieldTypes.Date]: FieldTypes.Date,
  [FieldTypes.File]: FieldTypes.File,
  [FieldTypes.Select]: FieldTypes.Select,
  [FieldTypes.Number]: FieldTypes.Number,
  [FieldTypes.Boolean]: FieldTypes.Boolean,
  [FieldTypes.LongText]: FieldTypes.LongText,
  [FieldTypes.TextArea]: FieldTypes.TextArea,
  [FieldTypes.FileList]: FieldTypes.FileList,
  [FieldTypes.Resource]: FieldTypes.Resource,
  [FieldTypes.HelpText]: FieldTypes.HelpText,
  [FieldTypes.MultiSelect]: FieldTypes.MultiSelect,
};
