import * as yup from "yup";
import { all, put, call, takeLatest } from "redux-saga/effects";

import appSlice from "app/slices/appSlice";
import masterSchemaApi from "api/masterSchema/masterSchema";

const {
  getMasterSchemaFieldsRequest,
  getMasterSchemaFieldsSuccess,
  getMasterSchemaFieldsError,

  getMasterSchemaOrganizationsRequest,
  getMasterSchemaOrganizationsSuccess,
  getMasterSchemaOrganizationsError,

  addFieldToMasterSchemaRequest,
  addFieldToMasterSchemaSuccess,
  addFieldToMasterSchemaError,

  addGroupToMasterSchemaRequest,
  addGroupToMasterSchemaSuccess,
  addGroupToMasterSchemaError,

  updateFieldMasterSchemaRequest,
  updateFieldMasterSchemaSuccess,
  updateFieldMasterSchemaError,
} = appSlice.actions;

function makeMasterSchemaFields(organizationsByType) {
  const formattedOrganizations = formatMasterSchemaFieldsByOrganization(organizationsByType);

  let masterSchemaFields = formattedOrganizations.map((formattedOrganization) => {
    let masterSchemaFields = Object.keys(formattedOrganization.masterSchemaFields).map((masterSchemaFieldId) => {
      let label = "MasterSchema";
      label += "." + formattedOrganization.masterSchemaFields[masterSchemaFieldId];
      return {
        label: label,
        value: masterSchemaFieldId,
      };
    });
    return masterSchemaFields;
  });

  if (masterSchemaFields.length) {
    masterSchemaFields = masterSchemaFields.reduce((state, next) => state.concat(next));
  }

  let masterSchemaFieldsObject = {};

  for (let item of masterSchemaFields) {
    masterSchemaFieldsObject[parseInt(item.value)] = item;
  }

  return masterSchemaFieldsObject;
}

const convertMasterSchemaToFieldsList = (node, list, path = "") => {
  for (let field of node.fields) {
    list[field.id] = path + "." + field.name;
  }

  for (let group of node.groups) {
    convertMasterSchemaToFieldsList(group, list, path + "." + group.name);
  }
};

function formatMasterSchemaFieldsByOrganization(organizationsByType) {
  // let organizations = []
  //   .concat(organizationsByType.corporation)
  //   .concat(organizationsByType.network)
  //   .concat(organizationsByType.member_firm);

  return formatOrganizationMasterSchema(organizationsByType);
}

const formatOrganizationMasterSchema = (organizations) => {
  return organizations.map((organization) => {
    let list = {};
    if (organization.master_schema) {
      convertMasterSchemaToFieldsList(organization.master_schema.root, list, organization.master_schema.root.name);
    }
    return {
      organization: organization,
      masterSchemaFields: list,
    };
  });
};

function* getMasterSchemaFields() {
  try {
    const organizationsByType = yield call(masterSchemaApi.getOrganizationsMasterSchema);

    const fields = makeMasterSchemaFields(organizationsByType);

    yield put(getMasterSchemaFieldsSuccess(fields));
  } catch (error) {
    console.log(error);
    yield put(getMasterSchemaFieldsError(error));
  }
}

// NEW SAGA  -----------------------------

// ToDo: add is_system
const masterSchemaNodeSchema = {
  id: yup.number().required(),
  key: yup.string().required(),
  name: yup.string().required(),
  parentId: yup.number().required(),
  parentKey: yup.string().required(),
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

const serialiseNode = (node, { containable, composedKey = "-", path = [], rootChildren = [] }) => {
  const parentKey = composedKey;
  const { id, parent_id, master_schema_group_id, name, groups, fields, d_form_names } = node;

  path = [...path, name];
  composedKey = composedKey ? `${composedKey}/${id}` : id;

  const serialisedNode = {
    id,
    key: composedKey,
    name,
    containable,
    parentId: parent_id ?? master_schema_group_id,
    parentKey,
    path,
    ...(d_form_names ? { dFormNames: d_form_names } : {}),
  };

  if (fields) {
    serialisedNode.fields = [];

    fields.forEach((field) => {
      const serialisedField = serialiseNode(field, { containable: false, composedKey, path, rootChildren });

      rootChildren.push(serialisedField);
      serialisedNode.fields.push(serialisedField.key);
    });
  }

  if (groups) {
    serialisedNode.groups = [];

    groups.forEach((group) => {
      const serialisedGroup = serialiseNode(group, { containable: true, composedKey, path, rootChildren });

      rootChildren.push(serialisedGroup);
      serialisedNode.groups.push(serialisedGroup.key);
    });
  }

  return serialisedNode;
};

const serialiseRoot = (root) => {
  const rootChildren = [];

  const serialisedRoot = serialiseNode(root, { containable: true, composedKey: "", rootChildren });

  return {
    ...serialisedRoot,
    children: rootChildren,
  };
};

const serialiseMasterSchema = ({ id, name, organization_id, root }) => {
  return {
    id,
    name,
    organizationId: organization_id,
    root: serialiseRoot(root),
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

const invariantOrganization = (organization) => organizationInterface.validate(organization);

const invariantField = (field) => masterSchemaFieldInterface.validate(field);

const invariantGroup = (group) => masterSchemaGroupInterface.validate(group);

function* getOrganizations() {
  try {
    const organizations = yield call(masterSchemaApi.getMasterSchemaOrganizations);
    const validSerialisedOrganizations = yield all(organizations.map(serialiseOrganization).map(invariantOrganization));

    yield put(getMasterSchemaOrganizationsSuccess(validSerialisedOrganizations));
  } catch (error) {
    yield put(getMasterSchemaOrganizationsError(error.message));
  }
}

function* addField({ payload }) {
  const { name, toGroup, toOrganization } = payload;
  try {
    const field = yield call(masterSchemaApi.addField, { name, groupId: toGroup.id });
    const validSerialisedField = yield invariantField(serialiseNode(field, { containable: false }));

    yield put(addFieldToMasterSchemaSuccess({ field: validSerialisedField, toGroup, toOrganization }));
  } catch (error) {
    yield put(addFieldToMasterSchemaError(error));
  }
}

function* addGroup({ payload }) {
  const { name, toParent, toOrganization } = payload;
  try {
    const group = yield call(masterSchemaApi.addGroup, { name, parentId: toParent.id });
    const validSerialisedGroup = yield invariantGroup(serialiseNode(group, { containable: true }));

    yield put(addGroupToMasterSchemaSuccess({ group: validSerialisedGroup, toParent, toOrganization }));
  } catch (error) {
    yield put(addGroupToMasterSchemaError(error));
  }
}

function* updateField({ payload }) {
  const { name, id, parentKey, organization } = payload;
  try {
    const field = yield call(masterSchemaApi.updateField, { id, name });
    console.log("api/field", field);
    const validSerialisedField = yield invariantField(serialiseNode(field, { containable: false }));
    console.log("api/valid-field", validSerialisedField);

    yield put(updateFieldMasterSchemaSuccess({ field: validSerialisedField, parentKey, organization }));
  } catch (error) {
    console.log("api/error", error);
    yield put(updateFieldMasterSchemaError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(addFieldToMasterSchemaRequest, addField),
    yield takeLatest(addGroupToMasterSchemaRequest, addGroup),
    yield takeLatest(updateFieldMasterSchemaRequest, updateField),
    yield takeLatest(getMasterSchemaOrganizationsRequest.type, getOrganizations),
    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
  ]);
}
