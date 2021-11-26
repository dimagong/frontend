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

  updateGroupMasterSchemaRequest,
  updateGroupMasterSchemaSuccess,
  updateGroupMasterSchemaError,

  fieldMakeParentMasterSchemaRequest,
  fieldMakeParentMasterSchemaSuccess,
  fieldMakeParentMasterSchemaError,

  groupMakeParentMasterSchemaRequest,
  groupMakeParentMasterSchemaSuccess,
  groupMakeParentMasterSchemaError,

  putNewAllowedElementsRequest,
  putNewAllowedElementsSuccess,
  putNewAllowedElementsError,
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

function* getOrganizations() {
  try {
    const organizations = yield call(masterSchemaApi.getOrganizations);
    console.log('organizations/api', organizations);
    yield put(getMasterSchemaOrganizationsSuccess({ organizations }));
  } catch (error) {
    console.error('organizations/error', error);
    yield put(getMasterSchemaOrganizationsError(error.message));
  }
}

function* addField({ payload }) {
  const { name, parentId } = payload;
  try {
    const field = yield call(masterSchemaApi.addField, { name, parentId });
    console.log("add_field/api", field);
    yield put(addFieldToMasterSchemaSuccess({ field }));
  } catch (error) {
    console.error("add_field/error", error);
    yield put(addFieldToMasterSchemaError(error));
  }
}

function* addGroup({ payload }) {
  const { name, parentId } = payload;
  try {
    const group = yield call(masterSchemaApi.addGroup, { name, parentId });
    console.log("add_group/api", group);
    yield put(addGroupToMasterSchemaSuccess({ group }));
  } catch (error) {
    console.log("add_group/error", error);
    yield put(addGroupToMasterSchemaError(error));
  }
}

function* updateField({ payload }) {
  const { id, name } = payload;
  try {
    const field = yield call(masterSchemaApi.updateField, { id, name });
    console.log("update_field/api", field);
    yield put(updateFieldMasterSchemaSuccess({ field }));
  } catch (error) {
    console.error("update_field/error", error);
    yield put(updateFieldMasterSchemaError(error));
  }
}

function* updateGroup({ payload }) {
  const { id, name } = payload;
  try {
    const group = yield call(masterSchemaApi.updateGroup, { id, name });
    console.log("update_group/api", group);
    yield put(updateGroupMasterSchemaSuccess({ group }));
    yield call(getOrganizations);
  } catch (error) {
    console.error("update_group/error", error);
    yield put(updateGroupMasterSchemaError(error));
  }
}

function* fieldMakeParent({ payload }) {
  const { nodeId, parentId } = payload;
  try {
    const field = yield call(masterSchemaApi.fieldMakeParent, { nodeId, parentId });
    console.log("field-make-parent/api", field);
    yield put(fieldMakeParentMasterSchemaSuccess({ field }));
  } catch (error) {
    console.error("field-make-parent/error", error);
    yield put(fieldMakeParentMasterSchemaError(error));
  }
}

function* groupMakeParent({ payload }) {
  const { nodeId, parentId } = payload;
  try {
    const group = yield call(masterSchemaApi.groupMakeParent, { nodeId, parentId });
    console.log("group-make-parent/api", group);
    yield put(groupMakeParentMasterSchemaSuccess({ group }));
    yield call(getOrganizations);
  } catch (error) {
    console.error("group-make-parent/error", error);
    yield put(groupMakeParentMasterSchemaError(error));
  }
}

function* putNewAllowedElements({ payload }) {
  //try {
    const response = yield call(masterSchemaApi.putNewAllowedElements, payload);
    yield put(putNewAllowedElementsSuccess({ response }));
  //} catch (error) {
  //  yield put(putNewAllowedElementsError(error));
  //}
}

export default function* () {
  yield all([
    yield takeLatest(addFieldToMasterSchemaRequest, addField),
    yield takeLatest(addGroupToMasterSchemaRequest, addGroup),
    yield takeLatest(updateFieldMasterSchemaRequest, updateField),
    yield takeLatest(updateGroupMasterSchemaRequest, updateGroup),
    yield takeLatest(fieldMakeParentMasterSchemaRequest, fieldMakeParent),
    yield takeLatest(groupMakeParentMasterSchemaRequest, groupMakeParent),
    yield takeLatest(getMasterSchemaOrganizationsRequest, getOrganizations),
    yield takeLatest(putNewAllowedElementsRequest, putNewAllowedElements),
    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
  ]);
}
