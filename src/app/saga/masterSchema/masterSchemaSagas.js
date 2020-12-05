import { all, put, call, takeLatest } from "redux-saga/effects";

import masterSchemaApi from "api/masterSchema";
import {
  getMasterSchemaFieldsRequest,
  getMasterSchemaFieldsSuccess,
  getMasterSchemaFieldsError,
} from "app/slices/appSlice";

function makeMasterSchemaFields(organizationsByType) {

  const formattedOrganizations = formatMasterSchemaFieldsByOrganization(organizationsByType);

  return formattedOrganizations.map((formattedOrganization) => {
    return Object.keys(formattedOrganization.masterSchemaFields).map((masterSchemaFieldId) => {
      let label = 'MasterSchema';
      label += '.' + formattedOrganization.masterSchemaFields[masterSchemaFieldId];
      return {
        label: label,
        value: masterSchemaFieldId
      }
    })
  });
}

const convertMasterSchemaToFieldsList = (node, list, path = '') => {
  for (let field of node.fields) {
    list[field.id] = path + '.' + field.name;
  }

  for (let group of node.groups) {
    convertMasterSchemaToFieldsList(group, list, path + '.' + group.name);
  }
};

function formatMasterSchemaFieldsByOrganization(organizationsByType) {
  let organizations = []
    .concat(organizationsByType.corporation)
    .concat(organizationsByType.network)
    .concat(organizationsByType.member_firm);

  return formatOrganizationMasterSchema(organizations);
}

const formatOrganizationMasterSchema = (organizations) => {
  return organizations.map((organization) => {
    let list = {};
    if (organization.master_schema) {
      convertMasterSchemaToFieldsList(organization.master_schema.root, list, organization.master_schema.root.name);
    }
    return {
      organization: organization,
      masterSchemaFields: list
    };
  });
};


function* getMasterSchemaFields() {
  try {
    const organizationsByType = yield call(masterSchemaApi.getOrganizationsMasterSchema);

    const fields = makeMasterSchemaFields(organizationsByType);
    console.log('makeMasterSchemaFields', fields);
    yield put(getMasterSchemaFieldsSuccess(fields));
  } catch (error) {
    console.log(error);
    yield put(getMasterSchemaFieldsError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
  ]);
}
