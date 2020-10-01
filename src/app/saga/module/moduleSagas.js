import { all, put, call, takeLatest } from "redux-saga/effects";

import moduleApi from "api/module/module";
import {
  getModulesSuccess,
  getModulesRequest,
  getModulesError,
} from "app/slices/appSlice";



function* getModules() {
  try {
    const modules = yield call(moduleApi.getModules);
    yield put(getModulesSuccess(modules));
  } catch (error) {
    console.log(error)
    yield put(getModulesError(error));
  }
}




export default function* () {
  yield all([
    yield takeLatest(getModulesRequest.type, getModules),
  ]);
}
