import { all, put, call, takeLatest } from "redux-saga/effects";

import authApi from "api/Auth/auth";
import {
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsError
} from "app/slices/appSlice";



function* getNotifications({ payload }) {
  try {
    yield call(authApi.login, payload);
    yield put(getNotificationsSuccess());
  } catch (error) {
    yield put(getNotificationsError(error));
  }
}





export default function* () {
  yield all([
    yield takeLatest(getNotificationsRequest.type, getNotifications),
  ]);
}
