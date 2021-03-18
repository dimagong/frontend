import { all, put, call, takeLatest } from "redux-saga/effects";

import moduleApi from "api/module/module";

import appSlice from 'app/slices/appSlice'

const {
  getModulesSuccess,
  getModulesRequest,
  getModulesError,
} = appSlice.actions;

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
