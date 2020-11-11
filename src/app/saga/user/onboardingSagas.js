import {all, put, call, takeLatest, select} from "redux-saga/effects";

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

  addUserGroupsSuccess,
  addUserGroupsRequest,
  addUserGroupsError,

  removeUserGroupsSuccess,
  removeUserGroupsRequest,
  removeUserGroupsError,

  updateUserModulesSuccess,
  updateUserModulesRequest,
  updateUserModulesError,
  setManager,
} from "app/slices/appSlice";
import {selectManager, selectManagers} from "app/selectors";


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
  console.log('payload', payload);
  try {
    const response = yield call(userApi.createUserOnboarding, payload);
    yield put(createUserOnboardingSuccess(response))
  } catch (error) {
    yield put(createUserOnboardingError(error));
  }
}

function* deleteUserOnboarding({payload}) {
  try {
    const onboarding = yield call(userApi.deleteUserOnboarding, payload);
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
    console.log("error", error);
    yield put(updateUserRolesError(error));
  }
}

function* addUserGroups({payload}) {
  try {
    const {groups} = yield call(userApi.addUsersGroup, payload);
    yield put(addUserGroupsSuccess({
      groups
    }));
  } catch (error) {
    console.log("error", error);
    yield put(addUserGroupsError(error));
  }
}

function* removeUserGroups({payload}) {
  try {
    const {groups} = yield call(userApi.removeUsersGroup, payload);
    yield put(removeUserGroupsSuccess({
      groups
    }));
  } catch (error) {
    console.log("error", error);
    yield put(removeUserGroupsError(error));
  }
}

function* updateUserModules({payload}) {
  try {
    const responce = yield call(userApi.updateUser, payload);
    yield put(updateUserModulesSuccess({modules: responce.modules}))
  } catch (error) {
    console.log("error", error);
    yield put(updateUserModulesError(error));
  }
}


export default function* () {
  yield all([
    yield takeLatest(getUserOnboardingRequest.type, getUserOnboarding),
    yield takeLatest(createUserOnboardingRequest.type, createUserOnboarding),
    yield takeLatest(deleteUserOnboardingRequest.type, deleteUserOnboarding),
    yield takeLatest(updateUserRolesRequest.type, updateUserRoles),
    yield takeLatest(addUserGroupsRequest.type, addUserGroups),
    yield takeLatest(removeUserGroupsRequest.type, removeUserGroups),
    yield takeLatest(updateUserModulesRequest.type, updateUserModules),
  ]);
}
