import { toast } from "react-toastify";

import { normalizeGroups, normalizeHierarchy, normalizeFields } from "api/masterSchema/normalizers";

const masterSchemaReducer = {
  getMasterSchemaFieldsSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.isError = null;
    state.masterSchema.fields = payload;
  },

  // MasterSchema

  getMasterSchemasSuccess: (state, { payload }) => {
    state.masterSchema.masterSchemas = payload;
    state.isLoading = false;
    state.isError = null;
  },

  setSelectedMasterSchemaId: (state, { payload }) => {
    state.masterSchema.selectedMasterSchemaId = payload.id;
  },

  // Hierarchy

  getMasterSchemaHierarchySuccess: (state, { payload }) => {
    const normalized = payload.hierarchy ? normalizeHierarchy(payload.hierarchy) : null;

    state.masterSchema.hierarchies[payload.masterSchemaId] = normalized;
    state.isLoading = false;
    state.isError = null;
  },

  getAllMasterSchemaGroupsSuccess(state, { payload }) {
    const { groups, masterSchemaId } = payload;

    state.masterSchema.groups[masterSchemaId] = normalizeGroups(groups);

    state.isError = false;
    state.isLoading = false;
  },

  // Unapproved fields

  getUnapprovedFieldsMasterSchemaSuccess(state, { payload }) {
    const { masterSchemaId, unapprovedFields } = payload;

    state.masterSchema.unapprovedFields[masterSchemaId] = normalizeFields(unapprovedFields);
    state.isError = false;
    state.isLoading = false;
  },

  approveUnapprovedFieldsSuccess(state, { payload }) {
    toast.success("The approving was successful");

    state.isError = false;
    state.isLoading = false;
  },

  // refactoring

  setMasterSchemaSearch(state, { payload }) {
    state.masterSchema.search = payload;
  },

  addFieldToMasterSchemaSuccess(state, { payload }) {
    toast.success("The field added successfully.");

    state.isError = false;
    state.isLoading = false;
  },

  addGroupToMasterSchemaSuccess(state, { payload }) {
    toast.success("The group added successfully.");

    state.isError = false;
    state.isLoading = false;
  },

  updateFieldMasterSchemaSuccess(state, { payload }) {
    toast.success("The field updated successfully.");

    state.isError = false;
    state.isLoading = false;
  },

  updateGroupMasterSchemaSuccess(state, { payload }) {
    toast.success("The group updated successfully.");

    state.isError = false;
    state.isLoading = false;
  },

  fieldMakeParentMasterSchemaSuccess(state, { payload }) {
    toast.success("The field moved successfully.");

    state.isError = false;
    state.isLoading = false;
  },

  fieldsMakeParentMasterSchemaSuccess(state, { payload }) {
    toast.success("The fields moved successfully.");

    state.isError = false;
    state.isLoading = false;
  },

  fieldsMergeMasterSchemaSuccess(state, { payload }) {
    toast.success("The selection was successfully merged");

    state.isError = false;
    state.isLoading = false;
  },

  groupMakeParentMasterSchemaSuccess(state, { payload }) {
    toast.success("The group moved successfully.");

    state.isError = false;
    state.isLoading = false;
  },

  getUsersByMasterSchemaFieldSuccess(state, { payload }) {
    const { users, fieldId } = payload;

    state.masterSchema.users[fieldId] = users;

    state.isError = false;
    state.isLoading = false;
  },

  getRelatedApplicationsSuccess(state, { payload }) {
    const { users, fieldId } = payload;

    state.masterSchema.related_applications[fieldId] = users;

    state.isError = false;
    state.isLoading = false;
  },
};

export default masterSchemaReducer;
