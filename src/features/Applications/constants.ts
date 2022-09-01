import { ELEMENT_TYPES, FIELD_TYPES } from "components/DForm/constants";

export const INITIAL_APPLICATION_DATA = {
  type: "application",
  name: "",
  description: "",
  isPrivate: false,
  organization: null,
  sectionsOrder: [],
  sections: {},
  groups: {},
  fields: {},
  errors: {},
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
  [ELEMENT_TYPES.field]: [EDIT_OPTIONS.properties, EDIT_OPTIONS.styling, EDIT_OPTIONS.dynamicRendering],
  [ELEMENT_TYPES.group]: [EDIT_OPTIONS.properties, EDIT_OPTIONS.dynamicRendering],
  [ELEMENT_TYPES.section]: [EDIT_OPTIONS.properties, EDIT_OPTIONS.dynamicRendering],
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

export const FIELDS_NOT_RELATED_TO_MASTER_SCHEMA = [FIELD_TYPES.helpText];
