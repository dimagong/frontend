import { all, put, call, takeLatest } from "redux-saga/effects";

import userApi from "api/User/user";
import dFormsApi from "api/Onboarding/dForms";
import groupRelations from "api/groupRelations/groupRelations";

import appSlice from "app/slices/appSlice";
import { queryClient } from "../../../api/queryClient";
import { ApplicationQueryKeys } from "../../../features/data/applicationQueries";

const {
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

  updateDFormFromParentRequest,
  updateDFormFromParentSuccess,
  updateDFormFromParentError,

  updateUserOnboardingReviewersRequest,
  updateUserOnboardingReviewersSuccess,
  updateUserOnboardingReviewersError,

  updateUserOnboardingWorkflowRequest,
  updateUserOnboardingWorkflowSuccess,
  updateUserOnboardingWorkflowError,
} = appSlice.actions;

function* getUserOnboarding({ payload }) {
  try {
    const onboarding = yield call(groupRelations.getGroupsRelationsByUserId, payload);
    yield put(getUserOnboardingSuccess({ ...onboarding }));
  } catch (error) {
    yield put(getUserOnboardingError(error));
  }
}

function* createUserOnboarding({ payload }) {
  try {
    const response = yield call(userApi.createUserOnboarding, payload);
    yield put(createUserOnboardingSuccess(response));
  } catch (error) {
    yield put(createUserOnboardingError(error));
  }
}

function* deleteUserOnboarding({ payload }) {
  try {
    yield call(userApi.deleteUserOnboarding, payload);
    yield put(deleteUserOnboardingSuccess(payload));
  } catch (error) {
    yield put(deleteUserOnboardingError(error));
  }
}

function* updateUserRoles({ payload }) {
  try {
    yield call(userApi.updateUserRoles, payload);
    yield put(updateUserRolesSuccess({ roles: payload.roles }));
  } catch (error) {
    console.log("error", error);
    yield put(updateUserRolesError(error));
  }
}

function* addUserGroups({ payload }) {
  try {
    const { groups } = yield call(userApi.addUsersGroup, payload);
    yield put(
      addUserGroupsSuccess({
        groups,
      })
    );
  } catch (error) {
    console.log("error", error);
    yield put(addUserGroupsError(error));
  }
}

function* removeUserGroups({ payload }) {
  try {
    const { groups } = yield call(userApi.removeUsersGroup, payload);
    yield put(
      removeUserGroupsSuccess({
        groups,
      })
    );
  } catch (error) {
    console.log("error", error);
    yield put(removeUserGroupsError(error));
  }
}

function* updateUserModules({ payload }) {
  try {
    const responce = yield call(userApi.updateUser, payload);
    yield put(updateUserModulesSuccess({ modules: responce.modules }));
  } catch (error) {
    console.log("error", error);
    yield put(updateUserModulesError(error));
  }
}

function* updateDFormFromParent({ payload }) {
  try {
    const dForm = yield call(dFormsApi.updateDFormFromParent, { id: payload.application.d_form.id });
    yield put(updateDFormFromParentSuccess(dForm));
    queryClient.invalidateQueries(ApplicationQueryKeys.byId(payload.application.id));
  } catch (error) {
    console.log("error", error);
    yield put(updateDFormFromParentError(error));
  }
}

function* updateUserOnboardingReviewers({ payload }) {
  const { managerId, onboardingId } = payload;
  try {
    const response = yield call(userApi.updateUserOnboardingReviewers, payload);
    yield put(updateUserOnboardingReviewersSuccess({ response, managerId, onboardingId }));
  } catch (error) {
    console.log("error", error);
    yield put(updateUserOnboardingReviewersError(error));
  }
}

function* updateUserOnboardingWorkflow({ payload }) {
  const { managerId, onboardingId } = payload;
  try {
    const response = yield call(userApi.updateUserOnboardingWorkflow, payload);
    yield put(updateUserOnboardingWorkflowSuccess({ response, managerId, onboardingId }));
  } catch (error) {
    console.log("error", error);
    yield put(updateUserOnboardingWorkflowError(error));
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
    yield takeLatest(updateDFormFromParentRequest.type, updateDFormFromParent),
    yield takeLatest(updateUserOnboardingReviewersRequest.type, updateUserOnboardingReviewers),
    yield takeLatest(updateUserOnboardingWorkflowRequest.type, updateUserOnboardingWorkflow),
  ]);
}
