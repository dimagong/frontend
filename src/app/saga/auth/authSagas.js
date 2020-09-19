import { all, put, call, takeLatest } from "redux-saga/effects";

import authApi from "api/Auth/auth";
import {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordError,
  loginSuccess,
  loginRequest,
  loginError,
  verifyPasswordSuccess,
  verifyPasswordRequest,
  verifyPasswordError,
  getProfileRequest
} from "app/slices/appSlice";



function* login({ payload }) {
  try {
    yield call(authApi.login, payload);
    yield put(loginSuccess());
    yield put(getProfileRequest())
  } catch (error) {
    yield put(loginError(error));
  }
}

function* resetPassword({ payload }) {
  try {
    yield call(authApi.resetPassword, payload);
    yield put(resetPasswordSuccess());
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

function* verifyPassword({ payload }) {
  try {
    yield call(authApi.verifyPassword, payload);
    yield put(verifyPasswordSuccess());
  } catch (error) {
    yield put(verifyPasswordError(error));
  }
}



export default function* () {
  yield all([
    yield takeLatest(resetPasswordRequest.type, resetPassword),
    yield takeLatest(verifyPasswordRequest.type, verifyPassword),
    yield takeLatest(loginRequest.type, login),
  ]);
}
