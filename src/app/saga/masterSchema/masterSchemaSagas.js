import { all, put, call, takeLatest, select } from "redux-saga/effects";

import appSlice from "app/slices/appSlice";
import masterSchemaApi from "api/masterSchema/masterSchema";
import { selectSelectedMasterSchemaId } from "app/selectors/masterSchemaSelectors";

const {
  getMasterSchemaFieldsRequest,
  getMasterSchemaFieldsSuccess,
  getMasterSchemaFieldsError,

  getMasterSchemasRequest,
  getMasterSchemasSuccess,
  getMasterSchemasError,

  getMasterSchemaHierarchyRequest,
  getMasterSchemaHierarchySuccess,
  getMasterSchemaHierarchyError,

  getAllMasterSchemaGroupsRequest,
  getAllMasterSchemaGroupsSuccess,
  getAllMasterSchemaGroupsError,

  getUnapprovedFieldsMasterSchemaRequest,
  getUnapprovedFieldsMasterSchemaSuccess,
  getUnapprovedFieldsMasterSchemaError,

  approveUnapprovedFieldsRequest,
  approveUnapprovedFieldsSuccess,
  approveUnapprovedFieldsError,

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

  fieldsMakeParentMasterSchemaRequest,
  fieldsMakeParentMasterSchemaSuccess,
  fieldsMakeParentMasterSchemaError,

  groupMakeParentMasterSchemaRequest,
  groupMakeParentMasterSchemaSuccess,
  groupMakeParentMasterSchemaError,

  getUsersByMasterSchemaFieldRequest,
  getUsersByMasterSchemaFieldSuccess,
  getUsersByMasterSchemaFieldError,

  getRelatedApplicationsRequest,
  getRelatedApplicationsSuccess,
  getRelatedApplicationsError,

  fieldsMergeMasterSchemaRequest,
  fieldsMergeMasterSchemaSuccess,
  fieldsMergeMasterSchemaError,
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

function* getAllMasterSchemas() {
  try {
    const masterSchemas = yield call(masterSchemaApi.getAll);
    yield put(getMasterSchemasSuccess(masterSchemas));
  } catch (error) {
    yield put(getMasterSchemasError(error));
  }
}

function* getHierarchy({ payload }) {
  try {
    const [hierarchy] = yield all([
      call(masterSchemaApi.getHierarchy, payload),
      call(getAllMasterSchemaGroups, { payload: { masterSchemaId: payload.masterSchemaId } }),
    ]);
    yield put(getMasterSchemaHierarchySuccess({ hierarchy, masterSchemaId: payload.masterSchemaId }));
  } catch (error) {
    yield put(getMasterSchemaHierarchyError(error));
  }
}

function* getAllMasterSchemaGroups({ payload }) {
  try {
    const groups = yield call(masterSchemaApi.getAllMasterSchemaGroups, payload);
    yield put(getAllMasterSchemaGroupsSuccess({ groups, masterSchemaId: payload.masterSchemaId }));
  } catch (error) {
    yield put(getAllMasterSchemaGroupsError(error));
  }
}

function* getUnapprovedFields({ payload }) {
  try {
    const unapprovedFields = yield call(masterSchemaApi.getUnapprovedFields, payload);
    yield put(getUnapprovedFieldsMasterSchemaSuccess({ unapprovedFields, masterSchemaId: payload.masterSchemaId }));
  } catch (error) {
    yield put(getUnapprovedFieldsMasterSchemaError(error));
  }
}

function* approveUnapprovedFields({ payload }) {
  try {
    yield call(masterSchemaApi.fieldsMakeParent, payload);
    // update whole hierarchy and unapproved fields
    yield call(getHierarchy, { payload: { masterSchemaId: payload.masterSchemaId } });
    yield call(getUnapprovedFields, { payload: { masterSchemaId: payload.masterSchemaId } });
    yield put(approveUnapprovedFieldsSuccess());
  } catch (error) {
    yield put(approveUnapprovedFieldsError(error));
  }
}

function* addField({ payload }) {
  const { name, parentId } = payload;
  const masterSchemaId = yield select(selectSelectedMasterSchemaId);
  try {
    const field = yield call(masterSchemaApi.addField, { name, parentId });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(addFieldToMasterSchemaSuccess({ field }));
  } catch (error) {
    yield put(addFieldToMasterSchemaError(error));
  }
}

function* addGroup({ payload }) {
  const { name, parentId } = payload;
  const masterSchemaId = yield select(selectSelectedMasterSchemaId);
  try {
    const group = yield call(masterSchemaApi.addGroup, { name, parentId });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(addGroupToMasterSchemaSuccess({ group }));
  } catch (error) {
    yield put(addGroupToMasterSchemaError(error));
  }
}

function* updateField({ payload }) {
  const { id, name } = payload;
  const masterSchemaId = yield select(selectSelectedMasterSchemaId);
  try {
    const field = yield call(masterSchemaApi.updateField, { id, name });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(updateFieldMasterSchemaSuccess({ field }));
  } catch (error) {
    yield put(updateFieldMasterSchemaError(error));
  }
}

function* updateGroup({ payload }) {
  const { id, name } = payload;
  const masterSchemaId = yield select(selectSelectedMasterSchemaId);
  try {
    const group = yield call(masterSchemaApi.updateGroup, { id, name });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(updateGroupMasterSchemaSuccess({ group }));
  } catch (error) {
    yield put(updateGroupMasterSchemaError(error));
  }
}

function* fieldMakeParent({ payload }) {
  const { nodeId, parentId } = payload;
  const masterSchemaId = yield select(selectSelectedMasterSchemaId);
  try {
    const field = yield call(masterSchemaApi.fieldMakeParent, { nodeId, parentId });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(fieldMakeParentMasterSchemaSuccess({ field }));
  } catch (error) {
    yield put(fieldMakeParentMasterSchemaError(error));
  }
}

function* fieldsMakeParent({ payload }) {
  const { masterSchemaId, parentId, fieldsIds } = payload;
  try {
    const fields = yield call(masterSchemaApi.fieldsMakeParent, { parentId, fieldsIds });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(fieldsMakeParentMasterSchemaSuccess({ fields, masterSchemaId, fieldsIds }));
  } catch (error) {
    yield put(fieldsMakeParentMasterSchemaError(error));
  }
}

function* fieldsMerge({ payload }) {
  const { parentId, fieldsIds } = payload;
  const masterSchemaId = yield select(selectSelectedMasterSchemaId);
  try {
    const fields = yield call(masterSchemaApi.fieldsMerge, { parentId, fieldsIds });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(fieldsMergeMasterSchemaSuccess({ fields, fieldsIds }));
  } catch (error) {
    yield put(fieldsMergeMasterSchemaError(error));
  }
}

function* groupMakeParent({ payload }) {
  const { nodeId, parentId } = payload;
  const masterSchemaId = yield select(selectSelectedMasterSchemaId);
  try {
    const group = yield call(masterSchemaApi.groupMakeParent, { nodeId, parentId });
    yield call(getHierarchy, { payload: { masterSchemaId } });
    yield put(groupMakeParentMasterSchemaSuccess({ group }));
  } catch (error) {
    yield put(groupMakeParentMasterSchemaError(error));
  }
}

function* getUsers({ payload }) {
  const { fieldId, name, abilities, organizations, member_firm_id } = payload;
  const users = yield call(masterSchemaApi.getUsers, { fieldId, name, abilities, organizations, member_firm_id });
  return { users };
}

function* getUsersByField({ payload }) {
  const { fieldId, name, abilities, organizations, member_firm_id } = payload;
  try {
    const { users } = yield call(getUsers, { payload: { fieldId, name, abilities, organizations, member_firm_id } });
    yield put(getUsersByMasterSchemaFieldSuccess({ users, fieldId }));
  } catch (error) {
    yield put(getUsersByMasterSchemaFieldError(error));
  }
}

function* getRelatedApplications({ payload }) {
  const { fieldId } = payload;
  try {
    const users = yield call(masterSchemaApi.getRelatedApplications, { fieldId });
    // console.log("related-table-applications/api", users);
    yield put(getRelatedApplicationsSuccess({ users, fieldId }));
  } catch (error) {
    // console.error("related-table-applications/error", error);
    yield put(getRelatedApplicationsError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(getMasterSchemasRequest, getAllMasterSchemas),
    yield takeLatest(getMasterSchemaHierarchyRequest, getHierarchy),
    yield takeLatest(getAllMasterSchemaGroupsRequest, getAllMasterSchemaGroups),
    yield takeLatest(getUnapprovedFieldsMasterSchemaRequest, getUnapprovedFields),
    yield takeLatest(approveUnapprovedFieldsRequest, approveUnapprovedFields),
    yield takeLatest(getUsersByMasterSchemaFieldRequest, getUsersByField),
    yield takeLatest(addFieldToMasterSchemaRequest, addField),
    yield takeLatest(addGroupToMasterSchemaRequest, addGroup),
    yield takeLatest(updateFieldMasterSchemaRequest, updateField),
    yield takeLatest(updateGroupMasterSchemaRequest, updateGroup),
    yield takeLatest(fieldMakeParentMasterSchemaRequest, fieldMakeParent),
    yield takeLatest(fieldsMakeParentMasterSchemaRequest, fieldsMakeParent),
    yield takeLatest(fieldsMergeMasterSchemaRequest, fieldsMerge),
    yield takeLatest(groupMakeParentMasterSchemaRequest, groupMakeParent),
    yield takeLatest(getRelatedApplicationsRequest, getRelatedApplications),

    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
  ]);
}
