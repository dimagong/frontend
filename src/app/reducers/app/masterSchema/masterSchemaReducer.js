import * as yup from "yup";
import { current } from "@reduxjs/toolkit";
import { pipe, get, isEqual, pick } from "lodash/fp";

/* Interfaces */

const masterSchemaNodeSchema = {
  id: yup.number().required(),
  key: yup.string().required(),
  name: yup.string().required(),
  parentId: yup.number().required(),
  parentKey: yup.string().required(),
  isSystem: yup.boolean().required(),
  containable: yup.boolean().required(),
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
const masterSchemaRootInterface = yup.object({
  ...masterSchemaNodeSchema,
  ...masterSchemaGroupSchema,
  children: yup
    .array(yup.lazy((child) => (child.group ? masterSchemaGroupInterface : masterSchemaFieldInterface)))
    .test((v) => Array.isArray(v)),
  parentKey: yup.string().nullable(),
  parentId: yup.number().nullable(),
});

const masterSchemaInterface = yup
  .object({
    id: yup.number(),
    name: yup.string(),
    root: masterSchemaRootInterface,
    organizationId: yup.string(),
  })
  .required();

const organizationInterface = yup
  .object({
    id: yup.number(),
    type: yup.string(),
    name: yup.string(),
    masterSchema: masterSchemaInterface,
  })
  .required();

const organizationsPayloadInterface = yup.object({ organizations: yup.array(organizationInterface) }).required();

/* Serializers */

const serialiseNode = (node, { containable, parent = null, rootChildren = [] }) => {
  const { id, parent_id, master_schema_group_id, name, groups, fields, d_form_names, is_system } = node;
  const key = parent ? `${parent.key}/${id}` : id;
  const path = parent ? [...parent.path, name] : [name];
  const parentKey = parent ? parent.key : null;

  const serialised = {
    id,
    key,
    name,
    path,
    parentKey,
    containable,
    isSystem: is_system,
    parentId: parent_id ?? master_schema_group_id,
    ...(d_form_names ? { dFormNames: d_form_names } : {}),
  };

  if (fields) {
    serialised.fields = [];

    fields.forEach((field) => {
      const serialisedField = serialiseNode(field, { containable: false, parent: serialised, rootChildren });

      rootChildren.push(serialisedField);
      serialised.fields.push(serialisedField.key);
    });
  }

  if (groups) {
    serialised.groups = [];

    groups.forEach((group) => {
      const serialisedGroup = serialiseNode(group, { containable: true, parent: serialised, rootChildren });

      rootChildren.push(serialisedGroup);
      serialised.groups.push(serialisedGroup.key);
    });
  }

  return serialised;
};

const serialiseRoot = (root) => {
  const rootChildren = [];
  const serialisedRoot = serialiseNode(root, { containable: true, rootChildren });

  return {
    ...serialisedRoot,
    children: rootChildren,
  };
};

const serialiseMasterSchema = ({ id, name, organization_id, root }) => {
  return {
    id,
    name,
    root: serialiseRoot(root),
    organizationId: organization_id,
  };
};

const serialiseOrganization = ({ id, type, name, master_schema }) => {
  return {
    id,
    type,
    name,
    masterSchema: serialiseMasterSchema(master_schema),
  };
};

const serialiseOrganizationsPayload = ({ organizations = [] }) => {
  return { organizations: organizations.map(serialiseOrganization) };
};

/* State searchers */

const findMasterSchemaRoot = (state, { id, containable }) => {
  const nodePredicate = pipe(pick(["containable", "id"]), isEqual({ id, containable }));

  return state.masterSchema.organizations
    .map(get("masterSchema.root"))
    .find((root) => root.id === id || root.children.find(nodePredicate));
};

const findMasterSchemaNode = (state, { id, containable }, root) => {
  const nodePredicate = pipe(pick(["containable", "id"]), isEqual({ id, containable }));

  if (root.id === id) return root;

  return root.children.find(nodePredicate);
  // const rootPredicate = pipe(pick(["id"]), isEqual({ id }));
  // const nodePredicate = pipe(pick(["containable", "id"]), isEqual({ id, containable }));
  //
  // return state.masterSchema.organizations
  //   .map(get("masterSchema.root"))
  //   .reduce((parent, root) => {
  //     if (parent) return parent;
  //
  //     if (rootPredicate(root)) return { node: root };
  //
  //     const node = root.children.find(nodePredicate);
  //
  //     return node ? { node } : null;
  //   }, null).node;
};

const findMasterSchemaField = (state, id, root) => findMasterSchemaNode(state, { id, containable: false }, root);

const findMasterSchemaGroup = (state, id, root) => findMasterSchemaNode(state, { id, containable: true }, root);

const findMasterSchemaRootAndParentField = (state, id) => {
  const type = { id, containable: false };
  const root = findMasterSchemaRoot(state, type);
  const parent = findMasterSchemaNode(state, type, root);

  return { root, parent };
};

const findMasterSchemaRootAndParentGroup = (state, id) => {
  const type = { id, containable: true };
  const root = findMasterSchemaRoot(state, type);
  const parent = findMasterSchemaNode(state, type, root);

  return { root, parent };
};

const masterSchemaReducer = {
  getMasterSchemaFieldsSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.isError = null;
    state.masterSchema.fields = payload;
  },

  // ToDo: move it all to its own domain
  getMasterSchemaOrganizationsSuccess: (state, { payload }) => {
    const serialised = serialiseOrganizationsPayload(payload);
    console.log("organizations/serialised", serialised);
    const valid = organizationsPayloadInterface.validateSync(serialised);
    console.log("organizations/valid", valid);

    state.masterSchema.organizations = valid.organizations;

    state.isLoading = false;
    state.isError = null;
  },

  addFieldToMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.field.master_schema_group_id;
    const { root, parent } = findMasterSchemaRootAndParentField(state, parentId);

    const serialised = serialiseNode(payload.field, { containable: false, parent });
    console.log("add_field/serialised", serialised);
    const valid = masterSchemaFieldInterface.validateSync(serialised);
    console.log("add_field/valid", valid);

    root.children.push(valid);
    parent.fields.push(valid.key);

    state.isError = false;
    state.isLoading = false;
  },

  addGroupToMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.group.parent_id;
    const { root, parent } = findMasterSchemaRootAndParentGroup(state, parentId);

    // fixme: Fix it on response side
    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const serialised = serialiseNode({ ...payload.group, ...RISKY_CLIENT_LOGIC }, { containable: true, parent });
    console.log("add_group/serialised", serialised);
    const valid = masterSchemaGroupInterface.validateSync(serialised);
    console.log("add_group/valid", valid);

    root.children.push(valid);
    parent.groups.push(valid.key);
  },

  updateFieldMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.field.master_schema_group_id;
    const { root, parent } = findMasterSchemaRootAndParentField(state, parentId);

    const serialised = serialiseNode(payload.field, { containable: false, parent });
    console.log("update_field/serialised", serialised);
    const valid = masterSchemaFieldInterface.validateSync(serialised);
    console.log("update_field/valid", valid);

    const field = findMasterSchemaField(state, valid.id, root);

    field.name = valid.name;
  },

  updateGroupMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.group.parent_id;
    const { root, parent } = findMasterSchemaRootAndParentGroup(state, parentId);

    const serialised = serialiseNode(payload.group, { containable: true, parent });
    console.log("update_group/serialised", serialised);
    const valid = masterSchemaGroupInterface.validateSync(serialised);
    console.log("update_group/serialised", serialised);

    const group = findMasterSchemaGroup(state, valid.id, root);

    group.name = valid.name;
  },

  fieldMakeParentMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.field.master_schema_group_id;
    const { root, parent } = findMasterSchemaRootAndParentGroup(state, parentId);

    const serialised = serialiseNode(payload.field, { containable: false, parent });
    console.log("field-make-parent/serialised", serialised);
    const valid = masterSchemaFieldInterface.validateSync(serialised);
    console.log("field-make-parent/valid", valid);

    const oldField = findMasterSchemaField(state, valid.id, root);
    const oldParent = findMasterSchemaGroup(state, oldField.parentId, root);

    parent.fields.push(valid.key);
    oldParent.fields = oldParent.fields.filter((key) => key !== oldField.key);
    root.children = root.children.map((child) => (child.key === oldField.key ? valid : child));

    state.masterSchema.selectedNodes = state.masterSchema.selectedNodes.map((key) =>
      key === oldField.key ? valid.key : key
    );
  },

  groupMakeParentMasterSchemaSuccess(state, { payload }) {
    const parentId = payload.group.parent_id;
    const { root, parent } = findMasterSchemaRootAndParentGroup(state, parentId);

    // fixme: Fix it on response side
    // Don't uncomment this!
    // Now this case will be overridden whole master schema.
    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const serialised = serialiseNode({ ...payload.group, ...RISKY_CLIENT_LOGIC, }, { containable: true, parent });
    console.log("group-make-parent/serialised", serialised);
    const valid = masterSchemaGroupInterface.validateSync(serialised);
    console.log("group-make-parent/valid", valid);

    const oldGroup = findMasterSchemaGroup(state, valid.id, root);
    // const oldParent = findMasterSchemaGroup(state, oldGroup.parentId, root);

    // fixme: Fix it on response side
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

    state.masterSchema.selectedNodes = state.masterSchema.selectedNodes.map((key) =>
      key === oldGroup.key ? valid.key : key
    );
  },

  setSelectedMasterSchemaNodes(state, { payload }) {
    state.masterSchema.selectedNodes = payload;
  },

  setSelectedOrganizationMasterSchema: (state, { payload }) => {
    state.masterSchema.selectedOrganization = payload;
  },
};

export default masterSchemaReducer;
