import { all, put, call, takeLatest } from "redux-saga/effects";

import groupApi from "api/Group/group";
import {
  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,
} from "app/slices/appSlice";
import {
  setGroups
} from "app/slices/groupSlice"



function* getGroups() {
  try {
    const  responce = yield call(groupApi.getGroups);
    yield put(getGroupsSuccess());
    yield put(setGroups(responce));
  } catch (error) {
    console.log(error)
    yield put(getGroupsError(error));
  }
}




export default function* () {
  yield all([
    yield takeLatest(getGroupsRequest.type, getGroups),
  ]);
}
