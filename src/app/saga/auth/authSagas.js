import { all, put, call, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";

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
  getProfileRequest,
  logout,
  resetAppSlice,
} from "app/slices/appSlice";

import {
  resetOnboardingSlice,
} from 'app/slices/onboardingSlice'


function* login({ payload }) {
  try {
    yield call(authApi.login, payload);
    yield put(loginSuccess());
    yield put(getProfileRequest())
  } catch (error) {
    yield put(loginError(error));
    if(error?.response?.data?.error?.message === "Forbidden") {
      toast.error("You are not allowed to login");
    } else {
      toast.error(error?.response?.data?.error?.message || "Something went wrong, try again later");
    }


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

function* onLogout() {
  yield put(resetAppSlice())
  yield put(resetOnboardingSlice());
}


export default function* () {
  yield all([
    yield takeLatest(resetPasswordRequest.type, resetPassword),
    yield takeLatest(verifyPasswordRequest.type, verifyPassword),
    yield takeLatest(loginRequest.type, login),
    yield takeLatest(logout.type, onLogout),
  ]);
}
