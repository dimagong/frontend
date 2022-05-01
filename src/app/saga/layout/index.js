import { all, put, takeLatest } from "redux-saga/effects";

import appSlice from "app/slices/appSlice";

const { setContext, hideContextSearch, showContextSearch } = appSlice.actions;

function* onSetContext({ payload }) {
  if (payload !== null) {
    yield put(hideContextSearch());
  } else {
    yield put(showContextSearch());
  }
}

export default function* () {
  yield all([yield takeLatest(setContext.type, onSetContext)]);
}
