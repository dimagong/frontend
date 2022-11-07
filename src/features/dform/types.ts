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

export enum DFormMultiSelectUIStyles {
  Checkboxes = "checkboxes",
}

export enum DFormResourceCompileOptionTypes {
  None,
  CompileOnOnboardingAssociation,
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

export type DFormSectionElement = {
  id: string;
  name: string;
  isHidden: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  isAlreadyViewed: boolean;
  relatedGroups: string[];
  conditions: any[];
};

export type DFormGroupElement = {
  id: string;
  name: string;
  isHidden: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  relatedFields: string[];
  conditions: any[];
};

export type DFormFieldElement = {
  id: string;
  type: DFormFieldTypes | DFormBlockTypes.HelpText;
  title: string;
  format: DFormDateFormatTypes;
  groupId: string;
  options: string[];
  uiStyle: DFormMultiSelectUIStyles | null;
  classes: DFormBlockSizeTypes;
  isHidden: boolean;
  isRequired: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId: number;

  resourceCompileOption: DFormResourceCompileOptionTypes;
  resourceManagerFieldId: string;

  helpTextValue: string;

  minLength: number | null;
  maxLength: number | null;
  minimum: number | null;
  maximum: number | null;
  conditions: any[];
};

export type DFormSchema = {
  fields: Record<string, DFormFieldElement>;
  groups: Record<string, DFormGroupElement>;
  sections: Record<string, DFormSectionElement>;
  sectionsOrder: Array<string>;
};

// Normalized schema

export type NormalizedDFormSectionElement = {
  id: string;
  name: string;
  isHidden: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  isAlreadyViewed: boolean;
  relatedGroups: string[];
  conditions: any[];
};

export type NormalizedDFormGroupElement = {
  id: string;
  name: string;
  isHidden: boolean;
  isDisabled: boolean;
  isProtected: boolean;
  relatedBlocks: string[];
  conditions: any[];
};

export type NormalizedDFormBlockElement = {
  id: string;
  label?: string;
  format?: DFormDateFormatTypes;
  groupId: string;
  options?: string[];
  uiStyle?: DFormMultiSelectUIStyles | null;
  isHidden?: boolean;
  fieldType?: DFormFieldTypes;
  blockType: DFormBlockTypes;
  blockSize?: DFormBlockSizeTypes;
  isRequired?: boolean;
  isDisabled?: boolean;
  isProtected?: boolean;
  isLabelShowing?: boolean;
  masterSchemaFieldId?: number;

  resourceCompileOption?: DFormResourceCompileOptionTypes;
  resourceManagerFieldId?: string;

  helpText?: string;

  minLength?: number | null;
  maxLength?: number | null;
  minimum?: number | null;
  maximum?: number | null;
  conditions?: any[];
};

export type NormalizedDFormSchema = {
  blocks: NormalizedDFormBlockElement[];
  groups: NormalizedDFormGroupElement[];
  sections: NormalizedDFormSectionElement[];
};
