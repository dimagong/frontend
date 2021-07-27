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

export default function* () {
  yield all([
    takeLatest(createMemberFirmRequest.type, createMemberFirm),
    takeLatest(getMemberFirmsRequest.type, getMemberFirms),
  ]);
}
