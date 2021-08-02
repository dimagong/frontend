import { all, put, call, takeLatest } from "redux-saga/effects";

import memberFirmsApi from 'api/memberFirms';

import appSlice from 'app/slices/appSlice';

const {
  createMemberFirmSuccess,
  createMemberFirmRequest,
  createMemberFirmError,

  getMemberFirmsSuccess,
  getMemberFirmsRequest,
  getMemberFirmsError,

  getMemberFirmUsersSuccess,
  getMemberFirmUsersRequest,
  getMemberFirmUsersError,

  getMemberFirmPotentialUsersSuccess,
  getMemberFirmPotentialUsersRequest,
  getMemberFirmPotentialUsersError,

  addMemberFirmUsersSuccess,
  addMemberFirmUsersRequest,
  addMemberFirmUsersError,

  removeMemberFirmUsersSuccess,
  removeMemberFirmUsersRequest,
  removeMemberFirmUsersError,

  getMasterSchemaFieldsForMemberFirmSuccess,
  getMasterSchemaFieldsForMemberFirmRequest,
  getMasterSchemaFieldsForMemberFirmError,

  getMemberFirmFormFieldsSuccess,
  getMemberFirmFormFieldsRequest,
  getMemberFirmFormFieldsError,

  updateMemberFirmFormValuesSuccess,
  updateMemberFirmFormValuesRequest,
  updateMemberFirmFormValuesError,
} = appSlice.actions;


function* createMemberFirm(payload) {
  const response = yield call(memberFirmsApi.createMemberFirm, payload);

  if (response?.message) {
    yield put(createMemberFirmError(response.message))
  } else {
    yield put(createMemberFirmSuccess(response))
  }
}

function* getMemberFirms() {
  const response = yield call(memberFirmsApi.getMemberFirms);

  if (response?.message) {
    yield put(getMemberFirmsError(response.message))
  } else {
    yield put(getMemberFirmsSuccess(response))
  }
}

function* getMemberFirmUsers({payload}) {
  const response = yield call(memberFirmsApi.getMemberFirmUsers, payload);

  if (response?.message) {
    yield put(getMemberFirmUsersError(response.message))
  } else {
    yield put(getMemberFirmUsersSuccess(response))
  }
}

function* getMemberFirmPotentialUsers({payload}) {
  const response = yield call(memberFirmsApi.getMemberFirmPotentialUsers, payload);

  if (response?.message) {
    yield put(getMemberFirmPotentialUsersError(response.message))
  } else {
    yield put(getMemberFirmPotentialUsersSuccess(response))
  }
}

function* addMemberFirmUsers({payload}) {
  const response = yield call(memberFirmsApi.addMemberFirmUsers, payload);

  if (response?.message) {
    yield put(addMemberFirmUsersError(response.message))
  } else {
    yield put(addMemberFirmUsersSuccess({response, isEdit: payload.isEdit}))
  }
}

function* removeMemberFirmUsers({payload}) {
  const response = yield call(memberFirmsApi.removeMemberFirmUsers, payload);

  if (response?.message) {
    yield put(removeMemberFirmUsersError(response.message))
  } else {
    yield put(removeMemberFirmUsersSuccess({response, isEdit: payload.isEdit}))
  }
}

function* getMasterSchemaFieldsForMemberFirm({payload}) {
  const response = yield call(memberFirmsApi.getMasterSchemaFieldsForMemberFirm, payload);

  if (response?.message) {
    yield put(getMasterSchemaFieldsForMemberFirmError(response.message))
  } else {
    yield put(getMasterSchemaFieldsForMemberFirmSuccess(response))
  }
}

function* getMemberFirmFormFields({payload}) {
  const response = yield call(memberFirmsApi.getMemberFirmFormFields, payload);

  if (response?.message) {
    yield put(getMemberFirmFormFieldsError(response.message))
  } else {
    yield put(getMemberFirmFormFieldsSuccess(response))
  }
}

function* updateMemberFirmFormValues({payload}) {
  const response = yield call(memberFirmsApi.updateMemberFirmFormValues, payload);

  if (response?.message) {
    yield put(updateMemberFirmFormValuesError(response.message))
  } else {
    yield put(getMemberFirmFormFieldsRequest(payload.memberFirmId));
    yield put(updateMemberFirmFormValuesSuccess(response))
  }
}

export default function* () {
  yield all([
    takeLatest(createMemberFirmRequest.type, createMemberFirm),
    takeLatest(getMemberFirmsRequest.type, getMemberFirms),
    takeLatest(getMemberFirmUsersRequest.type, getMemberFirmUsers),
    takeLatest(getMemberFirmPotentialUsersRequest.type, getMemberFirmPotentialUsers),
    takeLatest(addMemberFirmUsersRequest.type, addMemberFirmUsers),
    takeLatest(removeMemberFirmUsersRequest.type, removeMemberFirmUsers),
    takeLatest(getMasterSchemaFieldsForMemberFirmRequest.type, getMasterSchemaFieldsForMemberFirm),
    takeLatest(getMemberFirmFormFieldsRequest.type, getMemberFirmFormFields),
    takeLatest(updateMemberFirmFormValuesRequest.type, updateMemberFirmFormValues),
  ]);
}
