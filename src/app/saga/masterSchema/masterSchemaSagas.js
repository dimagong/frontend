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
  parentId: yup.number().required(),
  key: yup.string().required(),
  name: yup.string().required(),
  path: yup.array(yup.string()).required(),
  group: yup.boolean().required(),
};

const masterSchemaGroupSchema = {
  groups: yup
    .array()
    .transform((value) => Object.values(value))
    .of(yup.lazy(() => masterSchemaGroupInterface.default(undefined)))
    .test((v) => Array.isArray(v)),
  fields: yup
    .array()
    .transform((value) => Object.values(value))
    .of(yup.lazy(() => masterSchemaFieldInterface.default(undefined)))
    .test((v) => Array.isArray(v)),
};

const masterSchemaFieldInterface = yup.object({
  ...masterSchemaNodeSchema,
  dFormNames: yup.array().nullable(),
});

const masterSchemaGroupInterface = yup.object({
  ...masterSchemaNodeSchema,
  ...masterSchemaGroupSchema,
});

const masterSchemaRootInterface = yup.object({
  ...masterSchemaNodeSchema,
  ...masterSchemaGroupSchema,
  parentId: yup.number().nullable(),
  createdAt: yup.object().nullable(),
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

const serialiseMasterSchemaNode = (node, group = true, path = [], composedKey = "") => {
  const { id, parent_id, name, d_form_names, fields, groups } = node;

  path = [...path, name];
  composedKey = composedKey ? `${composedKey},${id}` : String(id);

  const serialised = {
    id,
    parentId: parent_id,
    key: composedKey,
    name,
    path,
    group,
  };

  if (d_form_names) {
    serialised.dFormNames = d_form_names;
  }

  if (fields) {
    serialised.fields = fields.map((field) => serialiseMasterSchemaNode(field, false, path, composedKey));
  }

  if (groups) {
    serialised.groups = groups.map((group) => serialiseMasterSchemaNode(group, true, path, composedKey));
  }

  return serialised;
};

const serialiseMasterSchema = ({ id, name, organization_id, root }) => {
  return {
    id,
    name,
    organizationId: organization_id,
    root: serialiseMasterSchemaNode(root),
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

export default function* () {
  yield all([
    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
    yield takeLatest(getMasterSchemaOrganizationsRequest.type, getMasterSchemaOrganizations),
  ]);
}
