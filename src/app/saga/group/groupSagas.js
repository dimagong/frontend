import { all, put, call, takeLatest } from "redux-saga/effects";

import groupApi from "api/Group/group";
import organizationApi from 'api/organizations'
import {
  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,

  getOrganizationsRequest,
  getOrganizationsSuccess,
  getOrganizationsError,
} from "app/slices/appSlice";

function* getGroups() {
  try {
    const  responce = yield call(groupApi.getGroups);
    yield put(getGroupsSuccess(responce));
  } catch (error) {
    console.log(error)
    yield put(getGroupsError(error));
  }
}

function* getOrganizations() {
  try {
    const response = yield call(organizationApi.getOrganizations);
    yield put(getOrganizationsSuccess(response));
  } catch (error) {
    yield put(getOrganizationsError(error))
  }
}


export default function* () {
  yield all([
    yield takeLatest(getGroupsRequest.type, getGroups),
    yield takeLatest(getOrganizationsRequest.type, getOrganizations)
  ]);
}
