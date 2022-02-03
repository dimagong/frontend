import * as yup from "yup";
import { toast } from "react-toastify";
import { pipe, get, includes } from "lodash/fp";

import { normalizeGroups, normalizeHierarchy, normalizeUnapproved } from "api/masterSchema/normalizers";

/* Interfaces */

const masterSchemaNodeSchema = {
  id: yup.number().required(),
  name: yup.string().required(),
  nodeId: yup.string().required(),
  updatedAt: yup.string().required(),
  createdAt: yup.string().required(),
  isSystem: yup.boolean().required(),
  isContainable: yup.boolean().required(),
  path: yup.array(yup.string()).required(),
};

const masterSchemaGroupSchema = {
  ...masterSchemaNodeSchema,
  fields: yup.array(yup.string()).test((v) => Array.isArray(v)),
  groups: yup.array(yup.string()).test((v) => Array.isArray(v)),
  parentId: yup.number().nullable(),
  parentNodeId: yup.string().nullable(),
  isMemberFirmGroup: yup.boolean().nullable(),
};

const masterSchemaFieldInterface = yup.object({
  ...masterSchemaNodeSchema,
  parentId: yup.number().required(),
  parentNodeId: yup.string().required(),
});

const masterSchemaGroupInterface = yup.object(masterSchemaGroupSchema);

const masterSchemaAbleMovementGroup = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
});

/* Serializers */

const serialiseNode = (node, { isContainable, parent = null, children = [] }) => {
  const {
    id,
    parent_id,
    master_schema_group_id,
    is_member_firm_group,
    name,
    groups,
    fields,
    application_names,
    is_system,
    updated_at,
    created_at,
    provided_by_full_name,
    parent_group_name,
  } = node;
  const path = parent ? [...parent.path, name] : [name];
  const parentNodeId = parent ? parent.nodeId : null;

  const serialised = {
    id,
    name,
    path,
    nodeId: `${isContainable ? "group" : "field"}${id}`,
    parentNodeId,
    isContainable,
    isSystem: is_system,
    createdAt: created_at,
    updatedAt: updated_at,
    ...(is_member_firm_group ? { isMemberFirmGroup: is_member_firm_group } : {}),
    ...(parent_group_name ? { parentGroupName: parent_group_name } : {}),
    providedByFullName: provided_by_full_name,
    parentId: parent_id ?? master_schema_group_id ?? null,
    applicationNames: application_names,
  };

  if (fields) {
    serialised.fields = [];

    fields.forEach((field) => {
      const serialisedField = serialiseNode(field, { isContainable: false, parent: serialised, children });

      children.push(serialisedField);
      serialised.fields.push(serialisedField.nodeId);
    });
  }

  if (groups) {
    serialised.groups = [];

    groups.forEach((group) => {
      const serialisedGroup = serialiseNode(group, { isContainable: true, parent: serialised, children });

      children.push(serialisedGroup);
      serialised.groups.push(serialisedGroup.nodeId);
    });
  }

  return serialised;
};

/* State searchers */

const getHierarchyAndParentByParentId = (state, id) => {
  return Object.entries(state.masterSchema.hierarchies).reduce(
    (acc, [, hierarchy]) => acc.parent ? acc : { parent: hierarchy.nodes[id], hierarchy },
    { hierarchy: null, parent: null }
  );
};

/* Reducers */

const masterSchemaReducer = {
  getMasterSchemaFieldsSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.isError = null;
    state.masterSchema.fields = payload;
  },

  setSelectedMasterSchema: (state, { payload }) => {
    state.masterSchema.selectedNodesKeys = [];
    state.masterSchema.selectedId = payload.id;
  },

  setSelectedMasterSchemaNodesKeys(state, { payload }) {
    state.masterSchema.selectedNodesKeys = payload;
  },

  setMasterSchemaSearch(state, { payload }) {
    state.masterSchema.search = payload;
  },

  getMasterSchemaListSuccess: (state, { payload }) => {
    state.masterSchema.list = payload.list;
    state.isLoading = false;
    state.isError = null;
  },

  getMasterSchemaHierarchySuccess: (state, { payload }) => {
    const { hierarchy, masterSchemaId } = payload;

    state.masterSchema.hierarchies[masterSchemaId] = hierarchy ? normalizeHierarchy(hierarchy) : null;
    state.isLoading = false;
    state.isError = null;
  },

  addFieldToMasterSchemaSuccess(state, { payload }) {
    const parentNodeId = `group${payload.field.master_schema_group_id}`;
    const { parent } = getHierarchyAndParentByParentId(state, parentNodeId);

    const serialised = serialiseNode(payload.field, { isContainable: false, parent });
    // console.log("add_field/serialised", serialised);
    masterSchemaFieldInterface.validateSync(serialised);
    // console.log("add_field/valid", valid);

    // hierarchy.children.push(valid);
    // parent.fields.push(valid.key);

    toast.success("The field added successfully.");
    state.isError = false;
    state.isLoading = false;
  },

  addGroupToMasterSchemaSuccess(state, { payload }) {
    const parentNodeId = payload.group.parent_id;
    const { parent } = getHierarchyAndParentByParentId(state, parentNodeId);

    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const serialised = serialiseNode({ ...payload.group, ...RISKY_CLIENT_LOGIC }, { isContainable: true, parent });
    // console.log("add_group/serialised", serialised);
    masterSchemaGroupInterface.validateSync(serialised);
    // console.log("add_group/valid", valid);

    // hierarchy.children.push(valid);
    // parent.groups.push(valid.key);

    toast.success("The group added successfully.");
    state.isError = false;
    state.isLoading = false;
  },

  updateFieldMasterSchemaSuccess(state, { payload }) {
    const parentNodeId = `group${payload.field.master_schema_group_id}`;
    const { hierarchy, parent } = getHierarchyAndParentByParentId(state, parentNodeId);

    const serialised = serialiseNode(payload.field, { isContainable: false, parent });
    // console.log("update_field/serialised", serialised);
    const valid = masterSchemaFieldInterface.validateSync(serialised);
    // console.log("update_field/valid", valid);

    hierarchy.children[valid.nodeId].name = valid.name;

    state.isError = false;
    state.isLoading = false;
  },

  updateGroupMasterSchemaSuccess(state, { payload }) {
    // const parentId = payload.group.parent_id;
    // const { root, parent } = findMasterSchemaRootAndParentGroup(state, parentId);
    // fixme: Fix it on response side
    // const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    // const serialised = serialiseNode({ ...payload.group, ...RISKY_CLIENT_LOGIC }, { containable: true, parent });
    // console.log("update_group/serialised", serialised);
    // const valid = masterSchemaGroupInterface.validateSync(serialised);
    // console.log("update_group/serialised", serialised);
    // const group = findMasterSchemaGroup(state, valid.id, root);
    // group.name = valid.name;
    state.isError = false;
    state.isLoading = false;
  },

  fieldMakeParentMasterSchemaSuccess(state, { payload }) {
    const parentNodeId = `group${payload.field.master_schema_group_id}`;
    const { parent } = getHierarchyAndParentByParentId(state, parentNodeId);

    const serialised = serialiseNode(payload.field, { isContainable: false, parent });
    // console.log("field-make-parent/serialised", serialised);
    masterSchemaFieldInterface.validateSync(serialised);
    // console.log("field-make-parent/valid", valid);

    // const oldField = getFieldById(hierarchy, valid.id);
    // const oldParent = getParentById(hierarchy, oldField.parentId);

    // parent.fields.push(valid.key);
    // oldParent.fields = oldParent.fields.filter((key) => key !== oldField.key);
    // hierarchy.children = hierarchy.children.map((child) => (child.key === oldField.key ? valid : child));

    state.isError = false;
    state.isLoading = false;
  },

  fieldsMakeParentMasterSchemaSuccess(state, { payload }) {
    // const parentId = payload.field.master_schema_group_id;
    // const { hierarchy, parent } = getHierarchyAndParentByParentId(state, parentId);
    //
    // const serialised = serialiseNode(payload.field, { isContainable: false, parent });
    // console.log("field-make-parent/serialised", serialised);
    // const valid = masterSchemaFieldInterface.validateSync(serialised);
    // console.log("field-make-parent/valid", valid);
    //
    // const oldField = getFieldById(hierarchy, valid.id);
    // const oldParent = getParentById(hierarchy, oldField.parentId);
    //
    // parent.fields.push(valid.key);
    // oldParent.fields = oldParent.fields.filter((key) => key !== oldField.key);
    // hierarchy.children = hierarchy.children.map((child) => (child.key === oldField.key ? valid : child));

    state.isError = false;
    state.isLoading = false;
  },

  fieldsMergeMasterSchemaSuccess(state, { payload }) {
    toast.success("The selection was successfully merged");
    state.isError = false;
    state.isLoading = false;
  },

  groupMakeParentMasterSchemaSuccess(state, { payload }) {
    const parentNodeId = `group${payload.group.parent_id}`;
    const { parent } = getHierarchyAndParentByParentId(state, parentNodeId);

    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const serialised = serialiseNode({ ...payload.group, ...RISKY_CLIENT_LOGIC }, { isContainable: true, parent });
    // console.log("group-make-parent/serialised", serialised);
    masterSchemaGroupInterface.validateSync(serialised);
    // console.log("group-make-parent/valid", valid);

    // const oldGroup = getParentById(hierarchy, valid.id);
    // const oldParent = findMasterSchemaGroup(state, oldGroup.parentId, root);

    // valid.fields = oldGroup.fields;
    // valid.groups = oldGroup.groups;
    // root.children = root.children.map((child) => {
    //   if (valid.fields.includes(child.key)) {
    //     const newKey = `${valid.key}/${child.id}`;
    //     const newPath = [...valid.path, child.name];
    //   }
    //
    //   return child;
    // });

    // parent.groups.push(valid.key);
    // oldParent.groups = oldParent.groups.filter((key) => key !== oldGroup.key);
    // root.children = root.children.map((child) => (child.key === oldGroup.key ? valid : child));

    state.isError = false;
    state.isLoading = false;
  },

  setUnapprovedMasterSchemaSuccess(state, { payload }) {
    const { id, unapproved } = payload;

    state.masterSchema.unapproved[id] = normalizeUnapproved(unapproved);
    state.isError = false;
    state.isLoading = false;
  },

  approveUnapprovedFieldsSuccess(state, { payload }) {
    toast.success("The approving was successful");
    const { masterSchemaId, fieldsIds } = payload;
    const oldUnapprovedFields = state.masterSchema.unapproved[masterSchemaId];

    oldUnapprovedFields.fields = oldUnapprovedFields.fields.filter(pipe(get("id"), includes(fieldsIds)));

    // const serialised = serialiseUnapproved({ ...unapproved, master_schema_id: masterSchemaId });
    // console.log("approve-fields/serialised", serialised);
    // const valid = masterSchemaUnapprovedInterface.validateSync(serialised);
    // console.log("approve-fields/valid", valid);

    state.isError = false;
    state.isLoading = false;
  },

  getMasterSchemaGroupsSuccess(state, { payload }) {
    const { groups, masterSchemaId } = payload;

    state.masterSchema.groups[masterSchemaId] = normalizeGroups(groups);

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
