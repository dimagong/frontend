import { all, put, call, takeLatest, select } from "redux-saga/effects";

import appSlice from "app/slices/appSlice";
import masterSchemaApi from "api/masterSchema/masterSchema";
import { selectSearch } from "app/selectors/masterSchemaSelectors";

const {
  getMasterSchemaFieldsRequest,
  getMasterSchemaFieldsSuccess,
  getMasterSchemaFieldsError,

  getMasterSchemaListRequest,
  getMasterSchemaListSuccess,
  getMasterSchemaListError,

  getMasterSchemaHierarchyRequest,
  getMasterSchemaHierarchySuccess,
  getMasterSchemaHierarchyError,

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

  setUnapprovedMasterSchemaRequest,
  setUnapprovedMasterSchemaSuccess,
  setUnapprovedMasterSchemaError,

  approveUnapprovedFieldsRequest,
  approveUnapprovedFieldsSuccess,
  approveUnapprovedFieldsError,

  getMasterSchemaGroupsRequest,
  getMasterSchemaGroupsSuccess,
  getMasterSchemaGroupsError,

  getUsersByMasterSchemaFieldRequest,
  getUsersByMasterSchemaFieldSuccess,
  getUsersByMasterSchemaFieldError,

  getRelatedApplicationsRequest,
  getRelatedApplicationsSuccess,
  getRelatedApplicationsError,
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

function* getList() {
  try {
    const list = yield call(masterSchemaApi.getList);
    // console.log("master-schema-list/api", list);
    yield put(getMasterSchemaListSuccess({ list }));
    yield all(list.map(({ id }) => call(getHierarchy, { payload: { id } })));
    yield all(list.map(({ id }) => call(getUnapproved, { payload: { id } })));
  } catch (error) {
    // console.error("master-schema-list/error", error);
    yield put(getMasterSchemaListError(error.message));
  }
}

function* getHierarchy({ payload: { id } }) {
  const search = yield select(selectSearch);
  try {
    const hierarchy = yield call(masterSchemaApi.getHierarchy, {
      id,
      name: search.value,
      application_ids: search.filters,
      date_begin: search.dates[0],
      date_end: search.dates[1]
    });
    // console.log("master-schema-hierarchy/api", hierarchy);
    // ToDo: redo it later, API should return id itself
    yield put(getMasterSchemaHierarchySuccess({ hierarchy, id }));
    yield call(getGroups, { payload: { masterSchemaId: id } });
  } catch (error) {
    // console.error("master-schema-hierarchy/error", error);
    yield put(getMasterSchemaHierarchyError(error.message));
  }
}

function* getUnapproved({ payload }) {
  const { id } = payload;
  try {
    const unapproved = yield call(masterSchemaApi.getUnapproved, { id });
    // console.log("unapproved/api", unapproved);
    yield put(setUnapprovedMasterSchemaSuccess({ unapproved, id }));
  } catch (error) {
    // console.error("unapproved/error", error);
    yield put(setUnapprovedMasterSchemaError(error));
  }
}

function* addField({ payload }) {
  const { name, parentId } = payload;
  try {
    const field = yield call(masterSchemaApi.addField, { name, parentId });
    // console.log("add_field/api", field);
    yield put(addFieldToMasterSchemaSuccess({ field }));
    yield call(getList);
  } catch (error) {
    // console.error("add_field/error", error);
    yield put(addFieldToMasterSchemaError(error));
  }
}

function* addGroup({ payload }) {
  const { name, parentId } = payload;
  try {
    const group = yield call(masterSchemaApi.addGroup, { name, parentId });
    // console.log("add_group/api", group);
    yield put(addGroupToMasterSchemaSuccess({ group }));
    yield call(getList);
  } catch (error) {
    // console.log("add_group/error", error);
    yield put(addGroupToMasterSchemaError(error));
  }
}

function* updateField({ payload }) {
  const { id, name } = payload;
  try {
    const field = yield call(masterSchemaApi.updateField, { id, name });
    // console.log("update_field/api", field);
    yield put(updateFieldMasterSchemaSuccess({ field }));
  } catch (error) {
    // console.error("update_field/error", error);
    yield put(updateFieldMasterSchemaError(error));
  }
}

function* updateGroup({ payload }) {
  const { id, name } = payload;
  try {
    const group = yield call(masterSchemaApi.updateGroup, { id, name });
    // console.log("update_group/api", group);
    yield put(updateGroupMasterSchemaSuccess({ group }));
    yield call(getList);
  } catch (error) {
    // console.error("update_group/error", error);
    yield put(updateGroupMasterSchemaError(error));
  }
}

function* fieldMakeParent({ payload }) {
  const { nodeId, parentId } = payload;
  try {
    const field = yield call(masterSchemaApi.fieldMakeParent, { nodeId, parentId });
    // console.log("field-make-parent/api", field);
    yield put(fieldMakeParentMasterSchemaSuccess({ field }));
    yield call(getList);
  } catch (error) {
    // console.error("field-make-parent/error", error);
    yield put(fieldMakeParentMasterSchemaError(error));
  }
}

function* fieldsMakeParent({ payload }) {
  const { masterSchemaId, parentId, fieldsIds } = payload;
  try {
    const fields = yield call(masterSchemaApi.fieldsMakeParent, { parentId, fieldsIds });
    // console.log("fields-make-parent/api", fields);
    yield put(fieldsMakeParentMasterSchemaSuccess({ fields, masterSchemaId, fieldsIds }));
    yield call(getList);
  } catch (error) {
    // console.error("fields-make-parent/error", error);
    yield put(fieldsMakeParentMasterSchemaError(error));
  }
}

function* groupMakeParent({ payload }) {
  const { nodeId, parentId } = payload;
  try {
    const group = yield call(masterSchemaApi.groupMakeParent, { nodeId, parentId });
    // console.log("group-make-parent/api", group);
    yield put(groupMakeParentMasterSchemaSuccess({ group }));
    yield call(getList);
  } catch (error) {
    // console.error("group-make-parent/error", error);
    yield put(groupMakeParentMasterSchemaError(error));
  }
}

function* approveFields({ payload }) {
  const { masterSchemaId, parentId, fieldsIds } = payload;
  try {
    const fields = yield call(masterSchemaApi.fieldsMakeParent, { parentId, fieldsIds });
    // console.log("approve-fields/api", fields);
    yield put(approveUnapprovedFieldsSuccess({ fields, masterSchemaId, fieldsIds }));
    yield call(getList);
  } catch (error) {
    // console.error("approve-fields/error", error);
    yield put(approveUnapprovedFieldsError(error));
  }
}

function* getGroups({ payload }) {
  const { masterSchemaId } = payload;
  try {
    const groups = yield call(masterSchemaApi.getGroups, { masterSchemaId });
    // console.log("get-groups/api", groups);
    yield put(getMasterSchemaGroupsSuccess({ groups, masterSchemaId }));
  } catch (error) {
    // console.error("get-groups/error", error);
    yield put(getMasterSchemaGroupsError(error));
  }
}

function* getHistoryByField({ payload }) {
  const { fieldId } = payload;
  const versions = yield call(masterSchemaApi.getFieldVersions, { fieldId });
  const history = { fieldId, versions };
  return history;
}

function* getUsers({ payload }) {
  const { fieldId, name, abilities, organizations, member_firm_id } = payload;
  try {
    const users = yield call(masterSchemaApi.getUsers, { fieldId, name, abilities, organizations, member_firm_id });
    const histories = yield all(users.map(({ field }) => call(getHistoryByField, { payload: { fieldId: field.id } })));
    yield put(getUsersByMasterSchemaFieldSuccess({ users, histories, fieldId }));
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
    yield takeLatest(getMasterSchemaListRequest, getList),
    yield takeLatest(getMasterSchemaHierarchyRequest, getHierarchy),
    yield takeLatest(setUnapprovedMasterSchemaRequest, getUnapproved),
    yield takeLatest(approveUnapprovedFieldsRequest, approveFields),
    yield takeLatest(getUsersByMasterSchemaFieldRequest, getUsers),
    yield takeLatest(addFieldToMasterSchemaRequest, addField),
    yield takeLatest(addGroupToMasterSchemaRequest, addGroup),
    yield takeLatest(updateFieldMasterSchemaRequest, updateField),
    yield takeLatest(updateGroupMasterSchemaRequest, updateGroup),
    yield takeLatest(fieldMakeParentMasterSchemaRequest, fieldMakeParent),
    yield takeLatest(fieldsMakeParentMasterSchemaRequest, fieldsMakeParent),
    yield takeLatest(groupMakeParentMasterSchemaRequest, groupMakeParent),
    yield takeLatest(getMasterSchemaGroupsRequest, getGroups),
    yield takeLatest(getRelatedApplicationsRequest, getRelatedApplications),
    yield takeLatest(getMasterSchemaFieldsRequest.type, getMasterSchemaFields),
  ]);
}
