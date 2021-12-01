import * as yup from "yup";
import { pipe, get, isEqual, pick, xorBy, includes } from "lodash/fp";

/* Interfaces */

const masterSchemaNodeSchema = {
  id: yup.number().required(),
  key: yup.string().required(),
  name: yup.string().required(),
  nodeId: yup.string().required(),
  parentId: yup.number().required(),
  parentKey: yup.string().required(),
  isSystem: yup.boolean().required(),
  isContainable: yup.boolean().required(),
  path: yup.array(yup.string()).required(),
};

const masterSchemaGroupSchema = {
  fields: yup.array(yup.string()).test((v) => Array.isArray(v)),
  groups: yup.array(yup.string()).test((v) => Array.isArray(v)),
};

const masterSchemaFieldInterface = yup.object({
  ...masterSchemaNodeSchema,
  dFormNames: yup.array().nullable(),
});

const masterSchemaGroupInterface = yup.object({
  ...masterSchemaNodeSchema,
  ...masterSchemaGroupSchema,
});

// Consider about children as hashmap, will it be faster ?
const masterSchemaUnapprovedInterface = yup.object({
  name: yup.string().required(),
  fields: yup.array(masterSchemaFieldInterface).test((v) => Array.isArray(v)),
  masterSchemaId: yup.number().required(),
});

// Consider about children as hashmap, will it be faster ?
const masterSchemaHierarchyInterface = yup.object({
  ...masterSchemaNodeSchema,
  ...masterSchemaGroupSchema,
  children: yup
    .array(yup.lazy((child) => (child.group ? masterSchemaGroupInterface : masterSchemaFieldInterface)))
    .test((v) => Array.isArray(v)),
  parentId: yup.number().nullable(),
  parentKey: yup.string().nullable(),
  masterSchemaId: yup.number().required(),
});

const masterSchemaInterface = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  organizationId: yup.number().required(),
  organizationType: yup.string().required(),
});

const masterSchemaListInterface = yup.object({ list: yup.array(masterSchemaInterface).test((v) => Array.isArray(v)) });

/* Serializers */

const serialiseNode = (node, { isContainable, parent = null, children = [] }) => {
  const { id, parent_id, master_schema_group_id, name, groups, fields, d_form_names, is_system } = node;
  const key = parent ? `${parent.key}/${id}` : id;
  const path = parent ? [...parent.path, name] : [name];
  const parentKey = parent ? parent.key : null;

  const serialised = {
    id,
    key,
    name,
    path,
    nodeId: `${isContainable ? 'group' : 'field'}${id}`,
    parentKey,
    isContainable,
    isSystem: is_system,
    parentId: parent_id ?? master_schema_group_id ?? null,
    ...(d_form_names ? { dFormNames: d_form_names } : {}),
  };

  if (fields) {
    serialised.fields = [];

    fields.forEach((field) => {
      const serialisedField = serialiseNode(field, { isContainable: false, parent: serialised, children });

      children.push(serialisedField);
      serialised.fields.push(serialisedField.key);
    });
  }

  if (groups) {
    serialised.groups = [];

    groups.forEach((group) => {
      const serialisedGroup = serialiseNode(group, { isContainable: true, parent: serialised, children });

      children.push(serialisedGroup);
      serialised.groups.push(serialisedGroup.key);
    });
  }

  return serialised;
};

const serialiseMasterSchemaHierarchy = (hierarchy) => {
  const children = [];
  const root = serialiseNode(hierarchy, { isContainable: true, children });

  return {
    ...root,
    children,
    masterSchemaId: hierarchy.master_schema_id,
  };
};

const serialiseUnapproved = (unapproved) => {
  const fields = [];
  const node = serialiseNode(unapproved, { isContainable: true, children: fields });

  return {
    name: node.name,
    fields,
    masterSchemaId: unapproved.master_schema_id,
  };
};

const serialiseMasterSchema = ({ id, name, organization_id, organization_type }) => {
  return {
    id,
    name,
    organizationId: organization_id,
    organizationType: organization_type,
  };
};

const serialiseMasterSchemaList = (list) => ({ list: list.map(serialiseMasterSchema) });

/* State searchers */

const getPredicateGroupById = (id) => pipe(pick(["isContainable", "id"]), isEqual({ id, isContainable: true }));
const getPredicateFieldById = (id) => pipe(pick(["isContainable", "id"]), isEqual({ id, isContainable: false }));

const getParentById = (hierarchy, id) => {
  return hierarchy.id === id ? hierarchy : hierarchy.children.find(getPredicateGroupById(id));
};

const getFieldById = (hierarchy, id) => hierarchy.children.find(getPredicateFieldById(id));

const getHierarchyAndParentByParentId = (state, id) => {
  return state.masterSchema.hierarchies.reduce(
    (acc, hierarchy) => (acc.parent ? acc : { parent: getParentById(hierarchy, id), hierarchy }),
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

  getMasterSchemaListSuccess: (state, { payload }) => {
    const serialised = serialiseMasterSchemaList(payload.list);
    // console.log("master-schema-list/serialised", serialised);
    const valid = masterSchemaListInterface.validateSync(serialised);
    // console.log("master-schema-list/valid", valid);

    state.masterSchema.list = valid.list;

    state.isLoading = false;
    state.isError = null;
  },

  getMasterSchemaHierarchySuccess: (state, { payload }) => {
    if (payload.hierarchy) {
      const serialised = serialiseMasterSchemaHierarchy({ ...payload.hierarchy, master_schema_id: payload.id });
      // console.log("master-schema-hierarchy/serialised", serialised);
      const valid = masterSchemaHierarchyInterface.validateSync(serialised);

      state.masterSchema.hierarchies = xorBy(state.masterSchema.hierarchies, [valid], "id");
    } else {
      const serialised = serialiseMasterSchemaHierarchy({ ...payload.hierarchy, master_schema_id: payload.id });
      state.masterSchema.hierarchies = xorBy(state.masterSchema.hierarchies, [serialised], "id");
    }

    state.isLoading = false;
    state.isError = null;
  },

  addFieldToMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.field.master_schema_group_id;
    const { hierarchy, parent } = getHierarchyAndParentByParentId(state, parentId);

    const serialised = serialiseNode(payload.field, { isContainable: false, parent });
    // console.log("add_field/serialised", serialised);
    const valid = masterSchemaFieldInterface.validateSync(serialised);
    // console.log("add_field/valid", valid);

    hierarchy.children.push(valid);
    parent.fields.push(valid.key);

    state.isError = false;
    state.isLoading = false;
  },

  addGroupToMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.group.parent_id;
    const { hierarchy, parent } = getHierarchyAndParentByParentId(state, parentId);

    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const serialised = serialiseNode({ ...payload.group, ...RISKY_CLIENT_LOGIC }, { isContainable: true, parent });
    // console.log("add_group/serialised", serialised);
    const valid = masterSchemaGroupInterface.validateSync(serialised);
    // console.log("add_group/valid", valid);

    hierarchy.children.push(valid);
    parent.groups.push(valid.key);

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
    const { hierarchy, parent } = getHierarchyAndParentByParentId(state, parentId);

    const serialised = serialiseNode(payload.field, { isContainable: false, parent });
    // console.log("field-make-parent/serialised", serialised);
    const valid = masterSchemaFieldInterface.validateSync(serialised);
    // console.log("field-make-parent/valid", valid);

    const oldField = getFieldById(hierarchy, valid.id);
    const oldParent = getParentById(hierarchy, oldField.parentId);

    parent.fields.push(valid.key);
    oldParent.fields = oldParent.fields.filter((key) => key !== oldField.key);
    hierarchy.children = hierarchy.children.map((child) => (child.key === oldField.key ? valid : child));

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

  groupMakeParentMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.group.parent_id;
    const { parent } = getHierarchyAndParentByParentId(state, parentId);

    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const serialised = serialiseNode({ ...payload.group, ...RISKY_CLIENT_LOGIC }, { isContainable: true, parent });
    // console.log("group-make-parent/serialised", serialised);
    const valid = masterSchemaGroupInterface.validateSync(serialised);
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
    const serialised = serialiseUnapproved({ ...payload.unapproved, master_schema_id: payload.id });
    // console.log("unapproved/serialised", serialised);
    const valid = masterSchemaUnapprovedInterface.validateSync(serialised);
    // console.log("unapproved/valid", valid);

    state.masterSchema.unapproved[payload.id] = valid;
    state.isError = false;
    state.isLoading = false;
  },

  approveUnapprovedFieldsSuccess(state, { payload }) {
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
};

export default masterSchemaReducer;
