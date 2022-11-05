/**
 * Enums
 */

export enum DFormElementTypes {
  // Currently there is no way to migration or fallback
  Block = "field",
  Group = "group",
  Section = "section",
}

export enum DFormBlockTypes {
  Field = "field",
  HelpText = "helpText",
}

export enum DFormFieldTypes {
  Boolean = "boolean",
  Date = "date",
  File = "file",
  FileList = "fileList",
  LongText = "longText",
  MultiSelect = "multiSelect",
  Number = "number",
  Resource = "resource",
  Select = "select",
  Text = "text",
  TextArea = "textArea",
}

export enum DFormAccessTypes {
  Allow = "allow",
  HardLock = "hard-lock",
  UserLock = "user-lock",
  UserUnlock = "user-unlock",
}

export enum DFormBlockSizeTypes {
  Half = "col-md-6",
  Full = "col-md-12",
}

export enum DFormDateFormatTypes {
  Date = "date",
  Time = "date-time",
}

/**
 * Types
 */

export type DFormFile = { name: string; file_id: number; custom_filename?: string };

export type DFormFiles = Array<DFormFile>;

export type DFormValue = {
  files: DFormFiles | null;
  value: string | number | boolean | Array<string> | null;
  master_schema_field_id: number;
};

export type DFormValues = Record<string, DFormValue>;

export type NormalizedDFormValue = DFormValue["value"] | DFormFile | DFormFiles;

export type NormalizedDFormValues = Record<string, NormalizedDFormValue>;

export type DFormSchema = {
  fields: Record<string, any>;
  groups: Record<string, any>;
  sections: Record<string, any>;
  sectionsOrder: Array<string>;
};
