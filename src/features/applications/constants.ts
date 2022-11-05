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
