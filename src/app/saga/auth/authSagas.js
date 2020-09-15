import { all, put, call, takeLatest } from "redux-saga/effects";

import authApi from "api/Auth/auth";
import {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordError,
  loginSuccess,
  loginRequest,
  loginError,
} from "app/slices/appSlice";



function* login({ payload }) {
  try {
    yield call(authApi.login, payload);
    yield put(loginSuccess());
  } catch (error) {
    yield put(loginError());
  }
}

function* resetPassword({ payload }) {
  try {
    yield call(authApi.resetPassword, payload);
    yield put(resetPasswordSuccess());
  } catch (error) {
    yield put(resetPasswordError());
  }
}



export default function* () {
  yield all([
    yield takeLatest(resetPasswordRequest.type, resetPassword),
    yield takeLatest(loginRequest.type, login),
  ]);
}
