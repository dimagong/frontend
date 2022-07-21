import { all, put, call, takeLatest } from "redux-saga/effects";

import authApi from "api/Auth/auth";

import appSlice from "app/slices/appSlice";
import onboardingSlice from "app/slices/onboardingSlice";

const { resetOnboardingSlice } = onboardingSlice.actions;

const { loginSuccess, loginRequest, loginError, getProfileRequest, logout, resetAppSlice } = appSlice.actions;

function* login() {
  try {
    yield put(loginSuccess());
    yield put(getProfileRequest());
  } catch (error) {
    yield put(loginError(error));
  }
}

function* onLogout() {
  yield call(authApi.logout);
  yield put(resetAppSlice());
  yield put(resetOnboardingSlice());
}

export default function* () {
  yield all([yield takeLatest(loginRequest.type, login), yield takeLatest(logout.type, onLogout)]);
}
