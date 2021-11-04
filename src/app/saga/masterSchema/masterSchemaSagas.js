import { all, put, call, takeLatest } from "redux-saga/effects";

import masterSchemaApi from "api/masterSchema/masterSchema";

import appSlice from 'app/slices/appSlice'

const {
  getMasterSchemaFieldsRequest,
  getMasterSchemaFieldsSuccess,
  getMasterSchemaFieldsError,

  getMasterSchemaOrganizationsRequest,
  getMasterSchemaOrganizationsSuccess,
  getMasterSchemaOrganizationsError,
}  = appSlice.actions;

function makeMasterSchemaFields(organizationsByType) {

  const formattedOrganizations = formatMasterSchemaFieldsByOrganization(organizationsByType);

  let masterSchemaFields = formattedOrganizations.map((formattedOrganization) => {
    let masterSchemaFields = Object.keys(formattedOrganization.masterSchemaFields).map((masterSchemaFieldId) => {
      let label = 'MasterSchema';
      label += '.' + formattedOrganization.masterSchemaFields[masterSchemaFieldId];
      return {
        label: label,
        value: masterSchemaFieldId
      }
    });
    return masterSchemaFields;
  });

  if (masterSchemaFields.length) {
    masterSchemaFields = masterSchemaFields.reduce((state, next) => state.concat(next));
  }

  let masterSchemaFieldsObject = {};

  for(let item of masterSchemaFields) {
    masterSchemaFieldsObject[parseInt(item.value)] = item;
  }

  return masterSchemaFieldsObject;
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
      masterSchemaFields: list
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

function* getMasterSchemaOrganizations() {
  const response = yield call(masterSchemaApi.getMasterSchemaOrganizations);

  if (response?.message) {
    yield put(getMasterSchemaOrganizationsError(response.message))
  } else {
    yield put(getMasterSchemaOrganizationsSuccess(response))
  }
}


export default function* () {
  yield all([
    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
    yield takeLatest(getMasterSchemaOrganizationsRequest.type, getMasterSchemaOrganizations),
  ]);
}
