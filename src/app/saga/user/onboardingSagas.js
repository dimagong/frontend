import { all, put, call, takeLatest, select } from "redux-saga/effects";

import userApi from "api/User/user";
import groupRelations from "api/groupRelations/groupRelations";
import {
  getUsersRequest,
  getUserOnboardingSuccess,
  getUserOnboardingRequest,
  getUserOnboardingError,
  createUserOnboardingSuccess,
  createUserOnboardingRequest,
  createUserOnboardingError,
  deleteUserOnboardingSuccess,
  deleteUserOnboardingRequest,
  deleteUserOnboardingError,
  updateUserRolesSuccess,
  updateUserRolesRequest,
  updateUserRolesError,
  updateUserGroupsSuccess,
  updateUserGroupsRequest,
  updateUserGroupsError,
  updateUserModulesSuccess,
  updateUserModulesRequest,
  updateUserModulesError,
  setManager,
} from "app/slices/appSlice";
import { selectManager, selectManagers } from "app/selectors";


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
  yield put(setManager(managers.find(manager => manager.id === currentMangager.id)))
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
    yield takeLatest(getUserOnboardingRequest.type, getUserOnboarding),
    yield takeLatest(createUserOnboardingRequest.type, createUserOnboarding),
    yield takeLatest(deleteUserOnboardingRequest.type, deleteUserOnboarding),
    yield takeLatest(updateUserRolesRequest.type, updateUserRoles),
    yield takeLatest(updateUserGroupsRequest.type, updateUserGroups),
    yield takeLatest(updateUserModulesRequest.type, updateUserModules),
  ]);
}
