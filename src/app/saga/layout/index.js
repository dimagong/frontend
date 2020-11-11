import { all, put, takeLatest } from "redux-saga/effects";

import {
  setContext,
  hideContextSearch,
} from "app/slices/appSlice";

function* onSetContext({payload}) {
  if (payload !== null) {
    yield put(hideContextSearch());
  }
}

export default function* () {
  yield all([
    yield takeLatest(setContext.type, onSetContext),
  ]);
}
