import { all, put, call, takeLatest, delay } from "redux-saga/effects";

import memberFirmsApi from "api/memberFirms";

import appSlice from "app/slices/appSlice";

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

  getMemberFirmSuccess,
  getMemberFirmRequest,
  getMemberFirmError,

  getMemberFirmActivitiesSuccess,
  getMemberFirmActivitiesRequest,
  getMemberFirmActivitiesError,

  addFieldToMemberFirmSuccess,
  addFieldToMemberFirmRequest,
  addFieldToMemberFirmError,

  createMasterSchemaFieldForMemberFirmSuccess,
  createMasterSchemaFieldForMemberFirmRequest,
  createMasterSchemaFieldForMemberFirmError,
} = appSlice.actions;

function* createMemberFirm(payload) {
  const response = yield call(memberFirmsApi.createMemberFirm, payload);

  if (response?.message) {
    yield put(createMemberFirmError(response.message));
  } else {
    yield put(createMemberFirmSuccess(response));
  }
}

function* getMemberFirmActivities({ payload }) {
  const response = yield call(memberFirmsApi.getMemberFirmActivities, payload);

  if (response?.message) {
    yield put(getMemberFirmActivitiesError(response.message));
  } else {
    yield put(getMemberFirmActivitiesSuccess(response));
  }
}

function* getMemberFirms() {
  const response = yield call(memberFirmsApi.getMemberFirms);

  if (response?.message) {
    yield put(getMemberFirmsError(response.message));
  } else {
    yield put(getMemberFirmsSuccess(response));
  }
}

function* getMemberFirm({ payload }) {
  const response = yield call(memberFirmsApi.getMemberFirm, payload);

  if (response?.message) {
    yield put(getMemberFirmError(response.message));
  } else {
    yield put(getMemberFirmSuccess(response));
  }
}

function* getMemberFirmUsers({ payload }) {
  const response = yield call(memberFirmsApi.getMemberFirmUsers, payload);

  if (response?.message) {
    yield put(getMemberFirmUsersError(response.message));
  } else {
    yield put(getMemberFirmUsersSuccess(response));
  }
}

function* getMemberFirmPotentialUsers({ payload }) {
  const response = yield call(memberFirmsApi.getMemberFirmPotentialUsers, payload);

  if (response?.message) {
    yield put(getMemberFirmPotentialUsersError(response.message));
  } else {
    yield put(getMemberFirmPotentialUsersSuccess(response));
  }
}

function* addMemberFirmUsers({ payload }) {
  const response = yield call(memberFirmsApi.addMemberFirmUsers, payload);

  if (response?.message) {
    yield put(addMemberFirmUsersError(response.message));
  } else {
    yield put(getMemberFirmRequest(payload.memberFirmId));
    yield put(addMemberFirmUsersSuccess({ response, isEdit: payload.isEdit }));
    yield delay(3000);
    yield put(getMemberFirmActivitiesRequest({ memberFirmId: payload.memberFirmId, page: 1 }));
  }
}

function* removeMemberFirmUsers({ payload }) {
  const response = yield call(memberFirmsApi.removeMemberFirmUsers, payload);

  if (response?.message) {
    yield put(removeMemberFirmUsersError(response.message));
  } else {
    yield put(getMemberFirmRequest(payload.memberFirmId));
    yield put(removeMemberFirmUsersSuccess({ response, isEdit: payload.isEdit }));
    yield delay(3000);
    yield put(getMemberFirmActivitiesRequest({ memberFirmId: payload.memberFirmId, page: 1 }));
  }
}

function* getMasterSchemaFieldsForMemberFirm({ payload }) {
  const response = yield call(memberFirmsApi.getMasterSchemaFieldsForMemberFirm, payload);

  if (response?.message) {
    yield put(getMasterSchemaFieldsForMemberFirmError(response.message));
  } else {
    yield put(getMasterSchemaFieldsForMemberFirmSuccess(response));
  }
}

function* getMemberFirmFormFields({ payload }) {
  const response = yield call(memberFirmsApi.getMemberFirmFormFields, payload);

  if (response?.message) {
    yield put(getMemberFirmFormFieldsError(response.message));
  } else {
    yield put(getMemberFirmFormFieldsSuccess(response));
  }
}

function* updateMemberFirmFormValues({ payload }) {
  const response = yield call(memberFirmsApi.updateMemberFirmFormValues, payload);

  if (response?.message) {
    yield put(updateMemberFirmFormValuesError(response.message));
  } else {
    yield put(getMemberFirmRequest(payload.memberFirmId));
    yield put(getMemberFirmFormFieldsRequest(payload.memberFirmId));
    yield put(updateMemberFirmFormValuesSuccess(response));
    yield delay(3000);
    yield put(getMemberFirmActivitiesRequest({ memberFirmId: payload.memberFirmId, page: 1 }));
  }
}

function* addFieldToMemberFirm(payload) {
  const response = yield call(memberFirmsApi.addFieldToMemberFirm, payload);

  if (response?.message) {
    yield put(addFieldToMemberFirmError(response?.message));
  } else {
    yield put(addFieldToMemberFirmSuccess(response));
  }
}

function* createMasterSchemaFieldForMemberFirm({ payload }) {
  const response = yield call(memberFirmsApi.createMasterSchemaFieldForMemberFirm, payload);

  if (response?.message) {
    yield put(createMasterSchemaFieldForMemberFirmError(response?.message));
  } else {
    yield put(createMasterSchemaFieldForMemberFirmSuccess(response));
    yield call(getMasterSchemaFieldsForMemberFirm, { payload: payload.member_firm_id });
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
    takeLatest(getMemberFirmRequest.type, getMemberFirm),
    takeLatest(getMemberFirmActivitiesRequest.type, getMemberFirmActivities),
    takeLatest(addFieldToMemberFirmRequest.type, addFieldToMemberFirm),
    takeLatest(createMasterSchemaFieldForMemberFirmRequest, createMasterSchemaFieldForMemberFirm),
  ]);
}
