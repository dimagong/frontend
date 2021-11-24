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

const masterSchemaNodeSchema = {
  id: yup.number().required(),
  key: yup.string().required(),
  name: yup.string().required(),
  parentId: yup.number().required(),
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

const serialiseNode = (node, { containable, composedKey = "", path = [], rootChildren = [] }) => {
  const { id, parent_id, master_schema_group_id, name, groups, fields, d_form_names } = node;

  path = [...path, name];
  composedKey = composedKey ? `${composedKey}/${id}` : id;

  const serialisedNode = {
    id,
    key: composedKey,
    name,
    containable,
    parentId: parent_id ?? master_schema_group_id,
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

const serialiseMasterSchemaRoot = (root) => {
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
    organizationId: organization_id,
    root: serialiseMasterSchemaRoot(root),
  };
};

const serialiseMasterSchemaOrganization = ({ id, type, name, master_schema }) => {
  return {
    id,
    type,
    name,
    masterSchema: serialiseMasterSchema(master_schema),
  };
};

const invariantMasterSchemaOrganization = (organization) => organizationInterface.validate(organization);

function* getMasterSchemaOrganizations() {
  try {
    const organizations = yield call(masterSchemaApi.getMasterSchemaOrganizations);
    const validSerialisedOrganizations = yield all(
      organizations.map(serialiseMasterSchemaOrganization).map(invariantMasterSchemaOrganization)
    );

    yield put(getMasterSchemaOrganizationsSuccess(validSerialisedOrganizations));
  } catch (error) {
    yield put(getMasterSchemaOrganizationsError(error.message));
  }
}

const invariantAddedField = (field) => masterSchemaFieldInterface.validate(field);

function* addField({ payload }) {
  const { name, toGroup, toOrganization } = payload;
  try {
    const field = yield call(masterSchemaApi.addField, { name, groupId: toGroup.id });
    const validSerialisedField = yield invariantAddedField(serialiseNode(field, { containable: false }));

    yield put(addFieldToMasterSchemaSuccess({ field: validSerialisedField, toGroup, toOrganization }));
  } catch (error) {
    yield put(addFieldToMasterSchemaError(error));
  }
}

const invariantAddedGroup = (group) => masterSchemaGroupInterface.validate(group);

function* addGroup({ payload }) {
  const { name, toParent, toOrganization } = payload;
  try {
    const group = yield call(masterSchemaApi.addGroup, { name, parentId: toParent.id });
    const validSerialisedGroup = yield invariantAddedGroup(serialiseNode(group, { containable: true }));

    yield put(addGroupToMasterSchemaSuccess({ group: validSerialisedGroup, toParent, toOrganization }));
  } catch (error) {
    yield put(addGroupToMasterSchemaError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(addFieldToMasterSchemaRequest, addField),
    yield takeLatest(addGroupToMasterSchemaRequest, addGroup),
    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
    yield takeLatest(getMasterSchemaOrganizationsRequest.type, getMasterSchemaOrganizations),
  ]);
}
