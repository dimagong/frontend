import { get, pipe, isEqual } from "lodash/fp";

export const selectMasterSchemaList = (state) => state?.app?.masterSchema.list;

export const selectMasterSchemaFields = (state) => state?.app?.masterSchema.fields;

export const selectSelectedNodesKeys = (state) => state?.app?.masterSchema.selectedNodesKeys;

export const selectSelectedId = (state) => state?.app?.masterSchema.selectedId;

export const selectSelectedNodes = (state) => {
  const selectedNodesKeys = selectSelectedNodesKeys(state);
  const selectedMasterSchemaHierarchy = selectSelectedMasterSchemaHierarchy(state);

  if (!selectedMasterSchemaHierarchy) return [];

  return selectedNodesKeys.map((key) => selectedMasterSchemaHierarchy.children.find(pipe(get("key"), isEqual(key))));
};

export const selectSelectedMasterSchemaHierarchy = (state) => {
  const { selectedId } = state?.app?.masterSchema;
  const hierarchies = state?.app?.masterSchema.hierarchies;

  return hierarchies.find(pipe(get("id"), isEqual(selectedId)));
};

export const selectUnapprovedFieldsOfSelectedOrganization = (state) => {
  // ToDo: return unapproved fields as single prop
  // const selectedOrganizationMasterSchema = selectMasterSchemaOfSelectedOrganization(state);
  // const unapproved = selectedOrganizationMasterSchema.root.children.find(({ name }) => name === "Unapproved");
  //
  // return selectedOrganizationMasterSchema.root.children.filter(({ key }) => unapproved.fields.includes(key));
  return [];
};
