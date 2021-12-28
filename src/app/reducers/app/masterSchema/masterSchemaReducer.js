import * as yup from "yup";
import { toast } from "react-toastify";
import { pipe, get, isEqual, pick, includes } from "lodash/fp";

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

const masterSchemaUnapprovedFieldInterface = yup.object({
  ...masterSchemaNodeSchema,
  applicationNames: yup.array().test((v) => Array.isArray(v)),
  providedByFullName: yup.string().nullable(),
  parentGroupName: yup.string().required(),
});

const masterSchemaGroupInterface = yup.object(masterSchemaGroupSchema);

const masterSchemaUnapprovedInterface = yup.array(masterSchemaUnapprovedFieldInterface).test((v) => Array.isArray(v));

const masterSchemaAbleMovementGroup = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
});

const userInterface = yup.object({
  id: yup.number().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  field: yup
    .object({
      value: yup.string().required(),
      type: yup.string().required(),
      date: yup.string().required(),
      files: yup
        .array(
          yup.object({
            name: yup.string().required(),
            mimeType: yup.string().required(),
            path: yup.string().required(),
            group: yup.string().required(),
          })
        )
        .test((v) => Array.isArray(v)),
    })
    .required(),
  permissions: yup
    .object({
      organization: yup.string().required(),
      ability: yup.string().required(),
    })
    .required(),
  avatar: yup.string().nullable(),
  avatarPath: yup.string().nullable(),
  memberFirm: yup.object().nullable(),
  memberFirmPermissions: yup.array(yup.string()).test((v) => Array.isArray(v)),
});

// eslint-disable-next-line no-unused-vars
const masterSchemaUsersInterface = yup.array(userInterface).test((v) => Array.isArray(v));

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

const serialiseUnapproved = (unapproved) => {
  return unapproved.map((field) => serialiseNode(field, { isContainable: false }));
};

/* State searchers */

const getPredicateGroupById = (id) => pipe(pick(["isContainable", "id"]), isEqual({ id, isContainable: true }));
const getPredicateFieldById = (id) => pipe(pick(["isContainable", "id"]), isEqual({ id, isContainable: false }));

const getParentById = (hierarchy, id) => {
  return hierarchy.id === id ? hierarchy : hierarchy.children.find(getPredicateGroupById(id));
};

const getFieldById = (hierarchy, id) => hierarchy.children.find(getPredicateFieldById(id));

const getHierarchyAndParentByParentId = (state, id) => {
  return Object.entries(state.masterSchema.hierarchies).reduce(
    (acc, [, hierarchy]) => {
      return acc.parent ? acc : { parent: getParentById(hierarchy, id), hierarchy };
    },
    { hierarchy: null, parent: null }
  );
};

/* Reducers */

const normalizeNode = (node, { isContainable, parent = null, childrenMap = new Map() }) => {
  const serialised = {
    ...node,
    nodeId: `${isContainable ? "group" : "field"}${node.id}`,
    parentNodeId: parent ? parent.nodeId : null,
    path: parent ? [...parent.path, node.name] : [node.name],
    isContainable,
  };

  if (node.fields) {
    serialised.fields = [];

    node.fields.forEach((field) => {
      const serialisedField = normalizeNode(field, { isContainable: false, parent: serialised, childrenMap });

      serialised.fields.push(serialisedField.nodeId);
      childrenMap.set(serialisedField.nodeId, serialisedField);
    });
  }

  if (node.groups) {
    serialised.groups = [];

    node.groups.forEach((group) => {
      const serialisedGroup = normalizeNode(group, { isContainable: true, parent: serialised, childrenMap });

      serialised.groups.push(serialisedGroup.nodeId);
      childrenMap.set(serialisedGroup.nodeId, serialisedGroup);
    });
  }

  return serialised;
};

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

    if (!hierarchy) {
      state.masterSchema.hierarchies[masterSchemaId] = null;
    }

    if (hierarchy) {
      // Normalize hierarchy
      const childrenMap = new Map();
      const root = normalizeNode(hierarchy, { isContainable: true, childrenMap });
      const nodeMap = new Map(childrenMap).set(root.nodeId, root);
      const normalizedHierarchy = {
        ...root,
        childrenMap,
        nodeMap,
      };

      state.masterSchema.hierarchies[hierarchy.masterSchemaId] = normalizedHierarchy;
    }

    state.isLoading = false;
    state.isError = null;
  },

  addFieldToMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.field.master_schema_group_id;
    const { parent } = getHierarchyAndParentByParentId(state, parentId);

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
    const parentId = payload.group.parent_id;
    const { parent } = getHierarchyAndParentByParentId(state, parentId);

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
    const parentId = payload.field.master_schema_group_id;
    const { hierarchy, parent } = getHierarchyAndParentByParentId(state, parentId);

    const serialised = serialiseNode(payload.field, { isContainable: false, parent });
    // console.log("update_field/serialised", serialised);
    const valid = masterSchemaFieldInterface.validateSync(serialised);
    // console.log("update_field/valid", valid);

    getFieldById(hierarchy, valid.id).name = valid.name;

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
    const parentId = payload.field.master_schema_group_id;
    const { parent } = getHierarchyAndParentByParentId(state, parentId);

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
    const parentId = payload.group.parent_id;
    const { parent } = getHierarchyAndParentByParentId(state, parentId);

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
    const serialised = serialiseUnapproved(unapproved);
    const valid = masterSchemaUnapprovedInterface.validateSync(serialised);

    state.masterSchema.unapproved[id] = valid;
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
    // const hierarchy = getHierarchyByMasterSchemaId(state, masterSchemaId);

    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const serialised = groups.map((group) => {
      return serialiseNode({ ...group, ...RISKY_CLIENT_LOGIC }, { isContainable: true });
    });
    // console.log("get-groups/serialised", serialised);
    const valid = yup
      .array(masterSchemaAbleMovementGroup)
      .test((v) => Array.isArray(v))
      .validateSync(serialised);
    // console.log("get-groups/valid", valid);

    state.masterSchema.groups[masterSchemaId] = valid;

    state.isError = false;
    state.isLoading = false;
  },

  getVersionsByMasterSchemaFieldSuccess(state, { payload }) {
    const { versions, fieldId, selectedId } = payload;

    state.masterSchema.versions[`${selectedId}/${fieldId}`] = versions;

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
