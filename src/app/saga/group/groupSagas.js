import { all, put, call, takeLatest, takeEvery } from "redux-saga/effects";

import groupApi from "api/Group/group";
import organizationApi from 'api/organizations'
import {
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

  getOrganizationLogoRequest,
  getOrganizationLogoSuccess,
  getOrganizationLogoError,

  setContext,
} from "app/slices/appSlice";

function* getGroups() {
  try {
    const  response = yield call(groupApi.getGroups);
    yield put(getGroupsSuccess(response));
  } catch (error) {
    console.log(error)
    yield put(getGroupsError(error));
  }
}

function* getOrganizationLogo({payload}) {
  try {
    const logoBase64 = yield call(organizationApi.getOrganizationLogo, payload)
    yield put(getOrganizationLogoSuccess({orgId: payload.id, orgType: payload.type, logoBase64}))

  } catch (error) {
    yield put(getOrganizationLogoError(error))
  }
}

function* getOrganizations() {
  try {
    const response = yield call(organizationApi.getOrganizations);
    yield put(getOrganizationsSuccess(response));

    const orgsWithLogo = response.filter(org => !!org.logo?.id && !org.logo?.base64)
    yield all(orgsWithLogo.map((org) => {
      return put(getOrganizationLogoRequest(org))
    }))
  } catch (error) {
    yield put(getOrganizationsError(error));
  }
}

function* createOrganization({payload}) {
  try {
    const  response = yield call(organizationApi.createOrganization, payload);
    yield put(setContext(null))
    yield put(createOrganizationSuccess(response));
  } catch (error) {
    console.log(error)
    yield put(createOrganizationError(error));
  }
}

function* updateOrganization({payload}) {
  try {
    const  response = yield call(organizationApi.updateOrganization, payload);
    yield put(updateOrganizationSuccess(response));
    yield put(getOrganizationLogoRequest(response));
  } catch (error) {
    console.log(error)
    yield put(updateOrganizationError(error));
  }
}


export default function* () {
  yield all([
    yield takeLatest(getGroupsRequest.type, getGroups),
    yield takeLatest(getOrganizationsRequest.type, getOrganizations),
    yield takeLatest(createOrganizationRequest.type, createOrganization),
    yield takeLatest(updateOrganizationRequest.type, updateOrganization),
    yield takeEvery(getOrganizationLogoRequest.type, getOrganizationLogo),
  ]);
}
