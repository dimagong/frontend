import { all, put, call, takeLatest, takeEvery } from "redux-saga/effects";

import userApi from "api/User/user";

import appSlice from 'app/slices/appSlice'

const {
  updateUserAvatarSuccess,
  updateUserAvatarRequest,
  updateUserAvatarError,

  deleteUserAvatarSuccess,
  deleteUserAvatarRequest,
  deleteUserAvatarError,

  getUserAvatarSuccess,
  getUserAvatarRequest,
  getUserAvatarError,
} = appSlice.actions;

function* getUserAvatar({payload}) {
  try {
    const {managerId} = payload;

    const url = yield call(userApi.getUserAvatar, {managerId});
    yield put(getUserAvatarSuccess({url, managerId}));

  } catch (error) {
    yield put(getUserAvatarError(error));
  }
}


function* updateUserAvatar({payload}) {
  try {
    const {files, managerId} = payload;
    const formData = new FormData();
    formData.set('avatar', files[0]);

    const avatar = yield call(userApi.updateUserAvatar, {formData, managerId});
    yield put(updateUserAvatarSuccess({avatar, managerId}));

  } catch (error) {
    yield put(updateUserAvatarError(error));
  }
}

function* deleteUserAvatar({payload}) {
  try {
    const {avatarId, managerId} = payload;

    yield call(userApi.deleteUserAvatar, {avatarId});
    yield put(deleteUserAvatarSuccess({managerId}));

  } catch (error) {
    yield put(deleteUserAvatarError(error));
  }
}



export default function* () {
  yield all([
    yield takeLatest(updateUserAvatarRequest.type, updateUserAvatar),
    yield takeLatest(deleteUserAvatarRequest.type, deleteUserAvatar),
    yield takeEvery(getUserAvatarRequest.type, getUserAvatar),
  ]);
}
