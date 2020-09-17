import { all, put, call, takeLatest } from "redux-saga/effects";

import userApi from "api/User/user";
import {
  getProfileSuccess,
  getProfileRequest,
  getProfileError,
} from "app/slices/appSlice";



function* getProfile({ payload }) {
  try {
    yield call(userApi.getProfile, payload);
    yield put(getProfileSuccess());
  } catch (error) {
    yield put(getProfileError(error));
  }
}



export default function* () {
  yield all([
    yield takeLatest(getProfileRequest.type, getProfile),
  ]);
}
