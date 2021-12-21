import { get, pipe, isEqual } from "lodash/fp";

export const selectMasterSchemaList = (state) => state?.app?.masterSchema.list;

export const selectMasterSchemaUsers = (state) => state?.app?.masterSchema.users;

export const selectSelectedId = (state) => state?.app?.masterSchema.selectedId;

export const selectMasterSchemaFields = (state) => state?.app?.masterSchema.fields;

export const selectRelatedApplications = fieldId => state => state?.app?.masterSchema?.related_applications[fieldId];

export const selectSearch = (state) => state?.app?.masterSchema.search;

export const selectSelectedUnapproved = (state) => {
  const selectedId = selectSelectedId(state);
  const { unapproved } = state?.app?.masterSchema;

  return unapproved[selectedId];
};

export const selectSelectedHierarchy = (state) => {
  const selectedId = selectSelectedId(state);
  const { hierarchies } = state?.app?.masterSchema;
  return hierarchies[selectedId];
};

export const selectMovementOptions = (state) => {
  const selectedId = selectSelectedId(state);
  const groups =  state?.app?.masterSchema.groups[selectedId] || [];
  return groups.map((group) => ({ label: group.name, value: group }));
};
