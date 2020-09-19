import { all, put, call, takeLatest } from "redux-saga/effects";

import userApi from "api/User/user";
import {
  getProfileSuccess,
  getProfileRequest,
  getProfileError,
} from "app/slices/appSlice";
import {loginWithJWT} from "app/actions/vuexy/auth/loginActions"
import {setUserProfile} from 'app/actions/vuexy/user/userActions'



function* getProfile() {
  try {
    const responce = yield call(userApi.getProfile);

    yield put(getProfileSuccess());
    yield put(loginWithJWT(responce))
    yield put(setUserProfile(responce))

  } catch (error) {
    yield put(getProfileError(error));
  }
}



export default function* () {
  yield all([
    yield takeLatest(getProfileRequest.type, getProfile),
  ]);
}
