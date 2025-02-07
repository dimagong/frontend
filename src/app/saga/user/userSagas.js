import { all, put, call, takeLatest, select, takeEvery } from "redux-saga/effects";

import userApi from "api/User/user";
import appSlice from "app/slices/appSlice";
import { queryClient } from "api/queryClient";
import { selectGroups, selectRoles } from "app/selectors";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { MasterSchemaHierarchyQueryKeys } from "api/masterSchema/hierarchy/masterSchemaHierarchyQueries";

const {
  getUsersSuccess,
  getActivitiesSuccess,
  getActivitiesRequest,
  getFilterRequest,
  getFilterSuccess,
  postFilterRequest,
  postFilterSuccess,
  postFilterError,
  deleteFilterRequest,
  deleteFilterSuccess,
  deleteFilterError,
  patchFilterRequest,
  patchFilterSuccess,
  patchFilterError,
  getUsersRequest,
  getUsersError,
  createUserSuccess,
  createUserRequest,
  createUserError,
  updateUserSuccess,
  updateUserRequest,
  updateUserError,
  getUserByIdSuccess,
  getUserByIdRequest,
  getUserByIdError,
  getGroupsRequest,
  getUserManagment,
  getUserOrganizationsRequest,
  getUserOrganizationsSuccess,
  getUserOrganizationsError,
  addUserOrganizationRequest,
  addUserOrganizationSuccess,
  addUserOrganizationError,
  removeUserOrganizationRequest,
  removeUserOrganizationSuccess,
  removeUserOrganizationError,

  switchUserAbilityInOrganizationRequest,
  switchUserAbilityInOrganizationSuccess,
  switchUserAbilityInOrganizationError,

  allowUserAbilityRequest,
  allowUserAbilitySuccess,
  allowUserAbilityError,

  disallowUserAbilityRequest,
  disallowUserAbilitySuccess,
  disallowUserAbilityError,
  setManager,
  setContext,
  removeUserNotifyRequest,
  removeUserNotifySuccess,
  removeUserNotifyError,

  updateActivitiesSuccess,
  updateActivitiesRequest,

  getOnboardingsByUserRequest,
  getOnboardingsByUserSuccess,
  getOnboardingsByUserError,

  getUserPermissionsRequest,
  getUserPermissionsSuccess,
  getUserPermissionsError,

  getDashboardDataRequest,
  getDashboardDataSuccess,

  getDashboardActivityRequest,
  getDashboardActivitySuccess,

  getSettingsRequest,
  getSettingsSuccess,

  postSettingsRequest,
  postSettingsSuccess,

  patchSettingsRequest,
  patchSettingsSuccess,

  getActivityTypesRequest,
  getActivityTypesSuccess,

  getDashboardDFormsRequest,
  getDashboardDFormsSuccess,

  getDashboardSnapshotDataRequest,
  getDashboardSnapshotDataSuccess,

  getUserOnboardingRequest,

  switchUserOrganizationRequest,
  switchUserOrganizationError,

  updateApllicationsOrderSuccess,
  updateApllicationsOrderError,
  updateApllicationsOrderRequest,
} = appSlice.actions;

function* getUsers() {
  const response = yield call(userApi.getUsers);
  yield put(getUsersSuccess(response));
}

function* updateApllicationsOrder({ payload }) {
  try {
    yield call(userApi.updateApllicationsOrder, payload);
    yield put(updateApllicationsOrderSuccess(payload));
  } catch (error) {
    yield put(updateApllicationsOrderError(error));
  }
}

function* getFilter() {
  const response = yield call(userApi.getFilter);
  yield put(getFilterSuccess(response));
}

function* getSettings() {
  const response = yield call(userApi.getSettings);
  yield put(getSettingsSuccess(response));
}

function* postSettings({ payload }) {
  const response = yield call(userApi.postSettings, payload);
  yield put(postSettingsSuccess({ payload, response }));
}

function* patchSettings({ payload }) {
  yield call(userApi.patchSettings, payload);
  yield put(patchSettingsSuccess(payload));
}

function* getActivities({ payload }) {
  const response = yield call(userApi.getActivities, payload);
  yield put(getActivitiesSuccess({ response, user_id: payload.managerId, shouldUpdate: payload.shouldUpdate }));
}

function* updateActivities({ payload }) {
  const response = yield call(userApi.getActivities, payload);
  yield put(updateActivitiesSuccess({ response, user_id: payload.managerId }));
}

function* getDashboardData({ payload }) {
  const response = yield call(userApi.getDashboardData, payload, "/api/user/application-dashboard");
  yield put(getDashboardDataSuccess({ response: response, payload: payload }));
}

function* getDashboardSnapshotData({ payload }) {
  const responseChartData = yield call(userApi.getDashboardData, payload, "/api/user/activity-current-state");
  const responseActivityList = yield call(userApi.getDashboardData, payload, "/api/user/application-dashboard");
  yield put(
    getDashboardSnapshotDataSuccess({
      response: {
        userDFormActivities: responseActivityList?.userDFormActivities,
        userDFormActivitiesSchedule: responseChartData?.userDFormCurrentStateSchedule?.data,
      },
      payload: payload,
    })
  );
}

function* getDashboardActivity({ payload }) {
  const response = yield call(userApi.getDashboardActivity, payload);
  yield put(getDashboardActivitySuccess({ response: response, payload: payload }));
}

function* getActivityTypes() {
  const response = yield call(userApi.getActivityTypes);
  yield put(getActivityTypesSuccess(response));
}

function* getDashboardDForms() {
  const response = yield call(userApi.getDashboardDForms);
  yield put(getDashboardDFormsSuccess(response));
}

function* postFilter({ payload }) {
  try {
    const response = yield call(userApi.postFilter, payload);
    yield put(postFilterSuccess({ response }));
  } catch (error) {
    yield put(postFilterError(error));
  }
}

function* deleteFilter({ payload }) {
  try {
    yield call(userApi.deleteFilter, payload.id);
    yield put(deleteFilterSuccess(payload));
  } catch (error) {
    yield put(deleteFilterError(error));
  }
}

function* patchFilter({ payload }) {
  try {
    yield call(userApi.patchFilter, payload);
    yield put(patchFilterSuccess({ payload }));
  } catch (error) {
    yield put(patchFilterError(error));
  }
}

function* getUserById({ payload }) {
  try {
    const user = yield call(userApi.getUserById, payload);
    const onboardings = yield call(userApi.getOnboradingsByUser, { id: payload.userId });
    yield put(getUserByIdSuccess({ ...user, onboardings }));
  } catch (error) {
    console.log(error);
    yield put(getUserByIdError(error));
  }
}

function* updateUser({ payload }) {
  try {
    const response = yield call(userApi.updateUser, payload);
    yield put(updateUserSuccess(response));
    yield put(updateActivitiesRequest({ managerId: payload.id, page: 1 }));
    yield put(getOnboardingsByUserRequest({ id: payload.id }));
    // Refresh active master schema hierarchy because it contains user data
    queryClient.invalidateQueries(MasterSchemaHierarchyQueryKeys.all());
  } catch (error) {
    yield put(updateUserError(error));
  }
}

function* createUser({ payload }) {
  try {
    const user = yield call(userApi.createUser, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map((group) => group.value),
    });
    yield put(createUserSuccess(user));
    yield put(setManager(user));
    yield put(setContext("User"));
  } catch (error) {
    console.log(error);
    yield put(createUserError(error));
  }
}

function* getUserManagmentData() {
  const groups = yield select(selectGroups);
  const roles = yield select(selectRoles);
  try {
    const response = yield call(userApi.getUsers);
    yield put(getUsersSuccess(response));

    if (!groups.length) {
      yield put(getGroupsRequest());
    }
    if (!roles.length) {
      // yield put(getRolesRequest())
    }
  } catch (error) {
    yield put(getUsersError(error));
  }
}

function* getUserOrganizations(userId) {
  const response = yield call(userApi.getUserOrganizations, userId);

  if (response?.message) {
    yield put(getUserOrganizationsError(response.message));
  } else {
    yield put(getUserOrganizationsSuccess({ response, userId: userId.payload }));
  }
}

function* addUserOrganization({ payload }) {
  const response = yield call(userApi.addUserOrganization, payload);

  if (response?.message) {
    yield put(addUserOrganizationError(response.message));
  } else {
    yield put(addUserOrganizationSuccess({ response, userId: payload.id }));
    yield put(getUserPermissionsRequest(payload.id));
    yield put(getUserOnboardingRequest({ userId: payload.id }));
  }
}

function* removeUserOrganization({ payload }) {
  const response = yield call(userApi.removeUserOrganization, payload);

  if (response?.message) {
    yield put(removeUserOrganizationError(response.message));
  } else {
    yield put(removeUserOrganizationSuccess({ response: payload, userId: payload.userId }));
    yield put(getUserPermissionsRequest(payload.userId));
  }
}

function* switchUserOrganization({ payload }) {
  const response = yield call(userApi.removeUserOrganization, payload.delOrg);
  if (response?.message) {
    yield put(switchUserOrganizationError(response.message));
  } else {
    yield put(removeUserOrganizationSuccess({ response: payload.delOrg, userId: payload.delOrg.userId }));
    yield put(addUserOrganizationRequest(payload.addOrg));
  }
}

function* switchUserAbilityInOrganization({ payload }) {
  try {
    yield call(disallowUserAbility, { payload: payload.toDisallow });
    yield call(allowUserAbility, { payload: payload.toAllow });
    yield put(switchUserAbilityInOrganizationSuccess());
  } catch (error) {
    put(switchUserAbilityInOrganizationError(error.message));
  }
}

function* allowUserAbility({ payload }) {
  try {
    const response = yield call(userApi.userAbilityAllow, payload);
    yield put(allowUserAbilitySuccess({ response, data: payload }));
    yield put(getUserPermissionsRequest(payload.user_id));
  } catch (error) {
    yield put(allowUserAbilityError(error.message));
  }
}

function* disallowUserAbility({ payload }) {
  try {
    const response = yield call(userApi.userAbilityDisallow, payload);
    yield put(disallowUserAbilitySuccess({ response, data: payload }));
    yield put(getUserPermissionsRequest(payload.user_id));
  } catch (error) {
    yield put(disallowUserAbilityError(error.message));
  }
}

function* removeUserNotify({ payload }) {
  const response = yield call(userApi.removeUserNotify, payload);

  if (response?.message) {
    yield put(removeUserNotifyError(response.message));
  } else {
    yield put(removeUserNotifySuccess());
  }
}

function* getOnboardingsByUser({ payload }) {
  try {
    const onboardings = yield call(userApi.getOnboradingsByUser, payload);
    yield put(getOnboardingsByUserSuccess({ user: payload, onboardings }));
  } catch (error) {
    yield put(getOnboardingsByUserError(error));
  }
}

function* handleSetManager({ payload }) {
  yield put(getOnboardingsByUserRequest(payload));
}

function* getUserPermissions({ payload }) {
  try {
    const result = yield call(userApi.getUserPermissions, payload);

    yield put(getUserPermissionsSuccess({ payload, result }));
  } catch (error) {
    yield put(getUserPermissionsError(error));
  }
}

export default function* () {
  yield all([
    yield takeLatest(updateApllicationsOrderRequest.type, updateApllicationsOrder),
    yield takeLatest(getOnboardingsByUserRequest.type, getOnboardingsByUser),
    yield takeLatest(getUsersRequest.type, getUsers),
    yield takeLatest(getFilterRequest.type, getFilter),
    yield takeLatest(getSettingsRequest.type, getSettings),
    yield takeLatest(postSettingsRequest.type, postSettings),
    yield takeLatest(patchSettingsRequest.type, patchSettings),
    yield takeLatest(getActivitiesRequest.type, getActivities),
    yield takeLatest(updateActivitiesRequest.type, updateActivities),
    yield takeEvery(getDashboardDataRequest.type, getDashboardData),
    yield takeEvery(getDashboardSnapshotDataRequest.type, getDashboardSnapshotData),
    yield takeEvery(getDashboardActivityRequest.type, getDashboardActivity),
    yield takeLatest(getActivityTypesRequest.type, getActivityTypes),
    yield takeLatest(getDashboardDFormsRequest.type, getDashboardDForms),
    yield takeLatest(postFilterRequest.type, postFilter),
    yield takeLatest(deleteFilterRequest.type, deleteFilter),
    yield takeLatest(patchFilterRequest.type, patchFilter),
    yield takeLatest(getUserByIdRequest.type, getUserById),
    yield takeLatest(updateUserRequest.type, updateUser),
    yield takeLatest(createUserRequest.type, createUser),
    yield takeEvery(getUserManagment.type, getUserManagmentData),
    yield takeLatest(getUserOrganizationsRequest.type, getUserOrganizations),
    yield takeLatest(addUserOrganizationRequest.type, addUserOrganization),
    yield takeLatest(removeUserOrganizationRequest.type, removeUserOrganization),
    yield takeLatest(switchUserOrganizationRequest.type, switchUserOrganization),
    yield takeLatest(switchUserAbilityInOrganizationRequest.type, switchUserAbilityInOrganization),
    yield takeLatest(allowUserAbilityRequest.type, allowUserAbility),
    yield takeLatest(disallowUserAbilityRequest.type, disallowUserAbility),
    yield takeLatest(removeUserNotifyRequest.type, removeUserNotify),
    yield takeLatest(setManager.type, handleSetManager),
    yield takeLatest(getUserPermissionsRequest.type, getUserPermissions),
  ]);
}
