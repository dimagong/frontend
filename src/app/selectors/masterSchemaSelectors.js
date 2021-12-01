import { get, pipe, isEqual } from "lodash/fp";

export const selectMasterSchemaList = (state) => state?.app?.masterSchema.list;

export const selectSelectedId = (state) => state?.app?.masterSchema.selectedId;

export const selectMasterSchemaFields = (state) => state?.app?.masterSchema.fields;

export const selectSelectedNodesKeys = (state) => state?.app?.masterSchema.selectedNodesKeys;

export const selectSelectedNodes = (state) => {
  const selectedNodesKeys = selectSelectedNodesKeys(state);
  const selectedHierarchy = selectSelectedHierarchy(state);

  if (!selectedHierarchy) return [];

  return selectedNodesKeys.map((key) => selectedHierarchy.children.find(pipe(get("key"), isEqual(key))));
};

export const selectSelectedUnapproved = (state) => {
  const selectedId = selectSelectedId(state);
  const { unapproved } = state?.app?.masterSchema;

  return unapproved[selectedId];
};

export const selectSelectedHierarchy = (state) => {
  const selectedId = selectSelectedId(state);
  const { hierarchies } = state?.app?.masterSchema;

  return hierarchies.find(pipe(get("masterSchemaId"), isEqual(selectedId)));
};

export const selectMovementOptions = (state) => {
  const hierarchy = selectSelectedHierarchy(state);
  return [hierarchy, ...hierarchy.children]
    .filter(get("isContainable"))
    .map((node) => ({ label: node.path.join("."), value: node }));
};
