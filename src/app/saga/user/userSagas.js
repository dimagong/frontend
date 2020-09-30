import { all, put, call, takeLatest } from "redux-saga/effects";

import userApi from "api/User/user";
import {
  getProfileSuccess,
  getProfileRequest,
  getProfileError,
  getUsersSuccess,
  getUsersRequest,
  getUsersError,
  updateUserAvatarSuccess,
  updateUserAvatarRequest,
  updateUserAvatarError,
  deleteUserAvatarSuccess,
  deleteUserAvatarRequest,
  deleteUserAvatarError,
  getUserAvatarSuccess,
  getUserAvatarRequest,
  getUserAvatarError,
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

function* getUsers() {
  try {
    const responce = yield call(userApi.getUsers);

    yield put(getUsersSuccess(responce));

  } catch (error) {
    yield put(getProfileError(error));
  }
}

function* getUserAvatar({payload}) {
  try {
    const {managerId} = payload;

    const url = yield call(userApi.getUserAvatar, managerId);
    yield put(getUserAvatarSuccess({url}));

  } catch (error) {
    yield put(getUserAvatarError(getUsersError));
  }
}


function* updateUserAvatar({payload}) {
  try {
    const {files} = payload;
    const formData = new FormData();
    formData.set('avatar', files[0]);

    const avatar = yield call(userApi.updateUserAvatar, formData);
    yield put(updateUserAvatarSuccess({avatar}));

  } catch (error) {
    yield put(updateUserAvatarError(getUsersError));
  }
}

function* deleteUserAvatar({payload}) {
  try {
    const {avatarId} = payload;

    yield call(userApi.deleteUserAvatar, avatarId);
    yield put(deleteUserAvatarSuccess({avatar: null, url: null}));

  } catch (error) {
    yield put(deleteUserAvatarError(getUsersError));
  }
}

export default function* () {
  yield all([
    yield takeLatest(getProfileRequest.type, getProfile),
    yield takeLatest(getUsersRequest.type, getUsers),
    yield takeLatest(updateUserAvatarRequest.type, updateUserAvatar),
    yield takeLatest(deleteUserAvatarRequest.type, deleteUserAvatar),
    yield takeLatest(getUserAvatarRequest.type, getUserAvatar),
  ]);
}
