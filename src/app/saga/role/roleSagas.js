import { all, put, call, takeLatest } from "redux-saga/effects";

import roleApi from "api/role/role";
import {
  getRolesSuccess,
  getRolesRequest,
  getRolesError,
} from "app/slices/appSlice";



function* getRoles() {
  try {
    const roles = yield call(roleApi.getRoles);
    yield put(getRolesSuccess(roles));
  } catch (error) {
    console.log(error)
    yield put(getRolesError(error));
  }
}




export default function* () {
  yield all([
    yield takeLatest(getRolesRequest.type, getRoles),
  ]);
}