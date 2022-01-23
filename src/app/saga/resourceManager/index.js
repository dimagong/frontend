import { all, put, call, takeLatest } from "redux-saga/effects";

import resourceManagerApi from "api/resourceManager";

import appSlice from 'app/slices/appSlice';

const {
  getResourceManagersListRequest,
  getResourceManagersListSuccess,
  getResourceManagersListError,

  getResourceManagerHierarchyRequest,
  getResourceManagerHierarchySuccess,
  getResourceManagerHierarchyError,

  createResourceManagerFieldRequest,
  createResourceManagerFieldSuccess,
  createResourceManagerFieldError,

  createResourceManagerGroupRequest,
  createResourceManagerGroupSuccess,
  createResourceManagerGroupError,

  getResourcePreviousVersionsRequest,
  getResourcePreviousVersionsSuccess,
  getResourcePreviousVersionsError,
}  = appSlice.actions;

function* getResourceManagersList() {
  const response = yield call(resourceManagerApi.getResourceManagersList);

  if (response?.message) {
    yield put(getResourceManagersListError(response.message))
  } else {
    yield put(getResourceManagersListSuccess(response))
  }
}

function* getResourceManagerHierarchy(resourceManagerId) {
  const response = yield call(resourceManagerApi.getResourceManagerHierarchy, resourceManagerId);

  if (response?.message) {
    yield put(getResourceManagerHierarchyError(response.message))
  } else {
    yield put(getResourceManagerHierarchySuccess(response))
  }
}

function* createResourceManagerField(payload) {
  const response = yield call(resourceManagerApi.createResourceManagerField, payload);

  if (response?.message) {
    yield put(createResourceManagerFieldError(response.message))
  } else {
    yield put(getResourceManagerHierarchyRequest(payload.payload.provided_by));
    yield put(createResourceManagerFieldSuccess(response))
  }
}

function* createResourceManagerGroup(payload) {
  const response = yield call(resourceManagerApi.createResourceManagerGroup, payload);

  if (response?.message) {
    yield put(createResourceManagerGroupError(response.message))
  } else {
    yield put(getResourceManagerHierarchyRequest(payload.payload.resource_manager_id));
    yield put(createResourceManagerGroupSuccess(response))
  }
}

function* getResourcePreviousVersions(payload) {
  const response = yield call(resourceManagerApi.getResourcePreviousVersions, payload);

  if (response?.message) {
    yield put(getResourcePreviousVersionsError(response.message))
  } else {
    yield put(getResourcePreviousVersionsSuccess(response))
  }
}

export default function* () {
  yield all([
    takeLatest(getResourceManagersListRequest.type, getResourceManagersList),
    takeLatest(getResourceManagerHierarchyRequest.type, getResourceManagerHierarchy),
    takeLatest(createResourceManagerFieldRequest.type, createResourceManagerField),
    takeLatest(createResourceManagerGroupRequest.type, createResourceManagerGroup),
    takeLatest(getResourcePreviousVersionsRequest.type, getResourcePreviousVersions),
  ]);
}
