import { all, put, call, takeLatest } from "redux-saga/effects";

import groupApi from "api/Group/group";
import appSlice from "app/slices/appSlice";
import { queryClient } from "api/queryClient";
import organizationApi from "api/organizations";
import { OrganizationFileQueryKeys } from "api/file/useOrganizationFileQueries";

const {
  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,

  getOrganizationsRequest,
  getOrganizationsSuccess,
  getOrganizationsError,

  createOrganizationRequest,
  createOrganizationSuccess,
  createOrganizationError,

  updateOrganizationRequest,
  updateOrganizationSuccess,
  updateOrganizationError,

  setContext,
} = appSlice.actions;

function* getGroups() {
  try {
    const response = yield call(groupApi.getGroups);
    yield put(getGroupsSuccess(response));
  } catch (error) {
    console.log(error);
    yield put(getGroupsError(error));
  }
}

function* getOrganizations() {
  try {
    const response = yield call(organizationApi.getOrganizations);
    yield put(getOrganizationsSuccess(response));
  } catch (error) {
    yield put(getOrganizationsError(error));
  }
}

function* createOrganization({ payload }) {
  try {
    const response = yield call(organizationApi.createOrganization, payload);
    yield put(setContext(null));
    yield put(createOrganizationSuccess(response));
    // [need refactor] Temporary invalidate query from sagas
    queryClient.invalidateQueries(OrganizationFileQueryKeys.logo(response.type, response.id));
    queryClient.invalidateQueries(OrganizationFileQueryKeys.brochure(response.type, response.id));
  } catch (error) {
    console.log(error);
    yield put(createOrganizationError(error));
  }
}

function* updateOrganization({ payload }) {
  try {
    const response = yield call(organizationApi.updateOrganization, payload);
    yield put(updateOrganizationSuccess(response));
    // [need refactor] Temporary invalidate query from sagas
    queryClient.invalidateQueries(OrganizationFileQueryKeys.logo(response.type, response.id));
    queryClient.invalidateQueries(OrganizationFileQueryKeys.brochure(response.type, response.id));
  } catch (error) {
    console.log(error);
    yield put(updateOrganizationError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(getGroupsRequest.type, getGroups),
    yield takeLatest(getOrganizationsRequest.type, getOrganizations),
    yield takeLatest(createOrganizationRequest.type, createOrganization),
    yield takeLatest(updateOrganizationRequest.type, updateOrganization),
  ]);
}
