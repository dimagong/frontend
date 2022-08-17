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

export const INITIAL_SECTION_DATA = {
  isProtected: false,
  isDisabled: false,
  isHidden: false,
  isAlreadyViewed: false,
  relatedGroups: [],
  conditions: "",
};

export const INITIAL_GROUP_DATA = {
  isProtected: false,
  relatedFields: [],
};

export const ELEMENT_TYPES = {
  group: "group",
  section: "section",
  field: "field",
};

export const FIELD_TYPES = {
  text: "text",
  date: "date",
  file: "file",
  select: "select",
  number: "number",
  boolean: "boolean", // ToDo: check it
  longText: "longText",
  textArea: "textarea",
  fileList: "fileList",
  resource: "resource",
  helpText: "helpText",
  multiSelect: "multiSelect",
};

export const DATE_WIDGET_FORMATS = ["date", "date-time"];

export const FIELD_INITIAL_SPECIFIC_PROPERTIES = {
  [FIELD_TYPES.text]: {
    minLength: undefined,
    maxLength: undefined,
  },
  [FIELD_TYPES.date]: {
    format: DATE_WIDGET_FORMATS[0],
  },
  [FIELD_TYPES.file]: {},
  [FIELD_TYPES.select]: {
    options: [],
  },
  [FIELD_TYPES.number]: {
    minimum: undefined,
    maximum: undefined,
  },
  [FIELD_TYPES.boolean]: {},
  [FIELD_TYPES.longText]: {
    minLength: undefined,
    maxLength: undefined,
  },
  [FIELD_TYPES.textArea]: {
    minLength: undefined,
    maxLength: undefined,
  },
  [FIELD_TYPES.fileList]: {},
  [FIELD_TYPES.resource]: {
    compileConditions: "",
    resourceLink: undefined,
  },
  [FIELD_TYPES.helpText]: {
    isMasterSchemaRelated: false,
  },
  [FIELD_TYPES.multiSelect]: {
    options: [],
  },
};

export const FIELD_STYLES_CLASSES = ["col-md-6", "col-md-12"];
export const MULTI_SELECT_UI_STYLES = ["default", "checkboxes"];

export const FIELDS_NOT_RELATED_TO_MASTER_SCHEMA = [FIELD_TYPES.helpText];

export const FIELD_SPECIFIC_UI_STYLE_PROPERTIES = {
  [FIELD_TYPES.text]: {},
  [FIELD_TYPES.date]: {},
  [FIELD_TYPES.file]: {},
  [FIELD_TYPES.select]: {},
  [FIELD_TYPES.number]: {},
  [FIELD_TYPES.boolean]: {},
  [FIELD_TYPES.longText]: {},
  [FIELD_TYPES.textArea]: {},
  [FIELD_TYPES.fileList]: {},
  [FIELD_TYPES.resource]: {},
  [FIELD_TYPES.helpText]: {},
  [FIELD_TYPES.multiSelect]: {
    uiStyle: MULTI_SELECT_UI_STYLES[0],
  },
};

export const INITIAL_FIELD_DATA = {
  type: FIELD_TYPES.text,
  title: "New field",
  masterSchemaPropertyId: "",
  isRequired: false,
  classes: FIELD_STYLES_CLASSES[1],
  isLabelShowing: true,
  conditions: [],
};

export const FIELD_COMMON_PROPERTIES = [...Object.keys(INITIAL_FIELD_DATA), "id"];

// get specific properties and convert it to object where key is field type and value is an array of properties names
export const FIELD_SPECIFIC_PROPERTIES = Object.keys(FIELD_INITIAL_SPECIFIC_PROPERTIES).reduce(
  (propertiesObject, property) => {
    propertiesObject[property] = [
      ...Object.keys(FIELD_INITIAL_SPECIFIC_PROPERTIES[property]),
      Object.keys(FIELD_SPECIFIC_UI_STYLE_PROPERTIES[property]),
    ];

    return propertiesObject;
  },
  {}
);
