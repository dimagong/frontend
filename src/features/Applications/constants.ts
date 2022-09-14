import { ElementTypes, FieldTypes } from "components/DForm";

export const INITIAL_APPLICATION_DATA = {
  type: "application",
  name: "",
  description: "",
  isPrivate: false,
  sectionsOrder: [],
  sections: {},
  groups: {},
  fields: {},
};

export const APPLICATION_PAGES = {
  DESCRIPTION: "Description",
  DESIGN: "Design mode",
  VERSIONING: "Versioning",
  REORDER: "Reorder",
  TEST_MODE: "Test mode",
};

export const EDIT_OPTIONS = {
  properties: "Properties",
  styling: "Styling",
  dynamicRendering: "Dynamic rendering",
};

export const ELEMENT_TYPE_SPECIFIC_EDIT_OPTIONS = {
  [ElementTypes.Field]: [EDIT_OPTIONS.properties, EDIT_OPTIONS.styling, EDIT_OPTIONS.dynamicRendering],
  [ElementTypes.Group]: [EDIT_OPTIONS.properties, EDIT_OPTIONS.dynamicRendering],
  [ElementTypes.Section]: [EDIT_OPTIONS.properties, EDIT_OPTIONS.dynamicRendering],
};

export const INITIAL_SECTION_DATA = {
  isHidden: false,
  isDisabled: false,
  isProtected: false,
  isAlreadyViewed: false,
  relatedGroups: [],
  conditions: [],
};

export const INITIAL_GROUP_DATA = {
  isHidden: false,
  isDisabled: false,
  isProtected: false,
  relatedFields: [],
  conditions: [],
};

export enum DateWidgetFormatTypes {
  Date = "date",
  Time = "date-time",
}

export const DATE_WIDGET_FORMATS = [DateWidgetFormatTypes.Date, DateWidgetFormatTypes.Time];

export enum FieldClassTypes {
  ColMd6 = "col-md-6",
  ColMd12 = "col-md-12",
}

export const FIELD_STYLES_CLASSES = [FieldClassTypes.ColMd6, FieldClassTypes.ColMd12];

export enum MultiSelectUIStyles {
  Checkboxes = "checkboxes",
}

export type FieldUIStyles = MultiSelectUIStyles;

export const MULTI_SELECT_UI_STYLES = [MultiSelectUIStyles.Checkboxes];

export const FIELDS_NOT_RELATED_TO_MASTER_SCHEMA = [FieldTypes.HelpText];

export enum ResourceCompileOptionTypes {
  None,
  CompileOnOnboardingAssociation,
}

export const ResourceCompileOptionLabel = {
  [ResourceCompileOptionTypes.CompileOnOnboardingAssociation]: "Compile on onboarding association",
};
