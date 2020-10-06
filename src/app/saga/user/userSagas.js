import { all, put, call, takeLatest, select } from "redux-saga/effects";

import userApi from "api/User/user";
import groupRelations from "api/groupRelations/groupRelations";
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
  getUserOnboardingSuccess,
  getUserOnboardingRequest,
  getUserOnboardingError,
  createUserOnboardingSuccess,
  createUserOnboardingRequest,
  createUserOnboardingError,
  deleteUserOnboardingSuccess,
  deleteUserOnboardingRequest,
  deleteUserOnboardingError,
  updateUserSuccess,
  updateUserRequest,
  updateUserError,
  updateUserRolesSuccess,
  updateUserRolesRequest,
  updateUserRolesError,
  updateUserGroupsSuccess,
  updateUserGroupsRequest,
  updateUserGroupsError,
  updateUserModulesSuccess,
  updateUserModulesRequest,
  updateUserModulesError,
  setManagerOnboarding,
  setUser,
} from "app/slices/appSlice";
import {loginWithJWT} from "app/actions/vuexy/auth/loginActions"
import {setUserProfile} from 'app/actions/vuexy/user/userActions'
import { selectManager, selectManagers, selectGroups } from "app/selectors";
import {normalizeGroups} from "utility/select/prepareSelectData";



function* getProfile() {
  try {
    const responce = yield call(userApi.getProfile);

    yield put(getProfileSuccess());
    yield put(loginWithJWT(responce))
    yield put(setUserProfile(responce))

  } catch (error) {
    console.log(error)
    yield put(getProfileError(error));
  }
}

function* getUsers() {
  try {
    const responce = yield call(userApi.getUsers);

    yield put(getUsersSuccess(responce));

  } catch (error) {
    yield put(getUsersError(error));
  }
}

function* getUserAvatar({payload}) {
  try {
    const {managerId} = payload;

    const url = yield call(userApi.getUserAvatar, {managerId});
    yield put(getUserAvatarSuccess({url}));

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
    yield put(updateUserAvatarSuccess({avatar}));

  } catch (error) {
    yield put(updateUserAvatarError(error));
  }
}

function* deleteUserAvatar({payload}) {
  try {
    const {avatarId} = payload;

    yield call(userApi.deleteUserAvatar, {avatarId});
    yield put(deleteUserAvatarSuccess());

  } catch (error) {
    yield put(deleteUserAvatarError(error));
  }
}

function* getUserOnboarding() {
  try {
    const onboarding = yield call(groupRelations.getGroupsRelations);
    const reviewers = yield call(userApi.getUsersData);
    yield put(getUserOnboardingSuccess({...onboarding, reviewers}));

  } catch (error) {
    yield put(getUserOnboardingError(error));
  }
}

function* createUserOnboarding({payload}) {
  // FIXME: TODO: return new user from API acfter create
  // TODO: create new onboarding -> get managers -> updated current manager
try {
  yield call(userApi.createUserOnboarding, payload);
  yield put(createUserOnboardingSuccess(payload))
  yield put(getUsersRequest())
  const managers = yield select(selectManagers);
  const currentMangager = yield select(selectManager);
  yield put(setUser(managers.find(manager => manager.id === currentMangager.id)))
} catch (error) {
  yield put(createUserOnboardingError(error));
}
}

function* deleteUserOnboarding({payload}) {
  try {
    const onboarding = yield call(userApi.deleteUserOnboarding, payload);
    console.log("deleteUserOnboarding",onboarding)
    yield put(deleteUserOnboardingSuccess(payload))
  } catch (error) {
  yield put(deleteUserOnboardingError(error));
}
}

function* updateUser({payload}) {
  try {
    const responce = yield call(userApi.updateUser, payload);
    yield put(updateUserSuccess(responce));
  } catch (error) {
  yield put(updateUserError(error));
  }
}

function* updateUserRoles({payload}) {
  try {
    const responce = yield call(userApi.updateUserRoles, payload);
    yield put(updateUserRolesSuccess({roles: payload.roles}));
  } catch (error) {
  console.log("error", error)
  yield put(updateUserRolesError(error));
  }
}

function* updateUserGroups({payload}) {
  try {
    const { groups } = yield call(userApi.updateGroupRoles, payload);
    yield put(updateUserGroupsSuccess({
      groups
    }));
  } catch (error) {
  console.log("error", error)
  yield put(updateUserGroupsError(error));
  }
}

function* updateUserModules({payload}) {
  try {
    const responce = yield call(userApi.updateUser, payload);
    yield put(updateUserModulesSuccess({modules:responce.modules}))
  } catch (error) {
  console.log("error", error)
  yield put(updateUserModulesError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(getProfileRequest.type, getProfile),
    yield takeLatest(getUsersRequest.type, getUsers),
    yield takeLatest(updateUserAvatarRequest.type, updateUserAvatar),
    yield takeLatest(deleteUserAvatarRequest.type, deleteUserAvatar),
    yield takeLatest(getUserAvatarRequest.type, getUserAvatar),
    yield takeLatest(getUserOnboardingRequest.type, getUserOnboarding),
    yield takeLatest(createUserOnboardingRequest.type, createUserOnboarding),
    yield takeLatest(deleteUserOnboardingRequest.type, deleteUserOnboarding),
    yield takeLatest(updateUserRequest.type, updateUser),
    yield takeLatest(updateUserRolesRequest.type, updateUserRoles),
    yield takeLatest(updateUserGroupsRequest.type, updateUserGroups),
    yield takeLatest(updateUserModulesRequest.type, updateUserModules),
  ]);
}
