export enum DFormElementTypes {
  Block = "block",
  Group = "group",
  Section = "section",
}

export enum DFormBlockTypes {
  Field = "field",
  HelpText = "helpText",
  Resource = "resource",
}

export enum DFormFieldTypes {
  Boolean = "boolean",
  Date = "date",
  File = "file",
  FileList = "fileList",
  LongText = "longText",
  MultiSelect = "multiSelect",
  Number = "number",
  Select = "select",
  Text = "text",
  TextArea = "textArea",
}

export enum DFormBlockSizeTypes {
  Half = "col-md-6",
  Full = "col-md-12",
}

export enum DFormAccessTypes {
  Allow = "allow",
  HardLock = "hard-lock",
  UserLock = "user-lock",
  UserUnlock = "user-unlock",
}

export type DFormFile = { name: string; file_id: number; custom_filename: string };

export type DFormFiles = Array<DFormFile>;
