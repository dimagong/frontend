import {all, put, call, takeLatest, select, takeEvery} from "redux-saga/effects";

import userApi from "api/User/user";
import {loginWithJWT} from "app/actions/vuexy/auth/loginActions"
import {prepareSelectGroups} from "utility/select/prepareSelectData";
import {selectGroups, selectRoles} from "app/selectors";
import organizationApi from '../../../api/organizations'

import appSlice from 'app/slices/appSlice'

const {
  getProfileSuccess,
  getProfileRequest,
  getProfileError,
  getUsersSuccess,
  getFilterRequest,
  getFilterSuccess,
  getFilterError,
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
  getRolesRequest,
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
  getUserOrganizationLogoRequest,
  getUserOrganizationLogoSuccess,
  getUserOrganizationLogoError,

  getOnboardingsByUserRequest,
  getOnboardingsByUserSuccess,
  getOnboardingsByUserError,
} = appSlice.actions;

function* getProfile() {
  try {
    const response = yield call(userApi.getProfile);

    yield put(getProfileSuccess(response));
    yield put(loginWithJWT(response));
    yield put(getUserOrganizationLogoRequest({logo: response.permissions.logo}));
    yield put(getFilterRequest());

  } catch (error) {
    console.log(error);
    yield put(getProfileError(error));
  }
}

function* getUsers() {
  const response = yield call(userApi.getUsers);
  yield put(getUsersSuccess(response));
}

function* getFilter() {
  const response = yield call(userApi.getFilter);
  yield put(getFilterSuccess(response));
}

function* postFilter({payload}) {
  try {
    console.log('payload', payload);
    const response = yield call(userApi.postFilter, payload);
    yield put(postFilterSuccess({response}))
  } catch (error) {
    console.log("error", error);
    yield put(postFilterError(error));
  }
}

function* deleteFilter({payload}) {
  try {
    const response = yield call(userApi.deleteFilter, payload);
    yield put(deleteFilterSuccess(payload))
  } catch (error) {
    console.log("error", error);
    yield put(deleteFilterError(error));
  }
}

function* patchFilter({payload}) {
  console.log('payload', payload);
  try {
    const response = yield call(userApi.patchFilter, payload);
    yield put(patchFilterSuccess({payload}))
  } catch (error) {
    console.log("error", error);
    yield put(patchFilterError(error));
  }
}

function* getUserById({payload}) {
  try {
    const response = yield call(userApi.getUserById, payload);

    yield put(getUserByIdSuccess(response));

  } catch (error) {
    console.log(error);
    yield put(getUserByIdError(error));
  }
}


function* updateUser({payload}) {
  try {
    const response = yield call(userApi.updateUser, payload);
    yield put(updateUserSuccess(response));
  } catch (error) {
    yield put(updateUserError(error));
  }
}


function* createUser({payload}) {
  try {
    const user = yield call(userApi.createUser, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map(group => group.value)
    });
    yield put(createUserSuccess(user));
    yield put(setManager(user));
    yield put(setContext("User"))

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
      yield put(getGroupsRequest())
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
    yield put(getUserOrganizationsError(response.message))
  } else {
    yield put(getUserOrganizationsSuccess({response, userId: userId.payload}))
  }
}

function* addUserOrganization({payload}) {
  const response = yield call(userApi.addUserOrganization, payload);

  if (response?.message) {
    yield put(addUserOrganizationError(response.message))
  } else {
    yield put(addUserOrganizationSuccess({response, userId: payload.id}))
  }
}

function* removeUserOrganization({payload}) {
  const response = yield call(userApi.removeUserOrganization, payload);

  if (response?.message) {
    yield put(removeUserOrganizationError(response.message))
  } else {
    yield put(removeUserOrganizationSuccess({response: payload, userId: payload.userId}))
  }
}

function* allowUserAbility({payload}) {
  const response = yield call(userApi.userAbilityAllow, payload);

  if (response?.message) {
    yield put(allowUserAbilityError(response.message))
  } else {
    yield put(allowUserAbilitySuccess({response, data: payload}))
  }
}

function* disallowUserAbility({payload}) {
  const response = yield call(userApi.userAbilityDisallow, payload);

  if (response?.message) {
    yield put(disallowUserAbilityError(response.message))
  } else {
    yield put(disallowUserAbilitySuccess({response, data: payload}))
  }

}

function* removeUserNotify() {
  const response = yield call(userApi.removeUserNotify);

  if (response?.message) {
    yield put(removeUserNotifyError(response.message))
  } else {
    yield put(removeUserNotifySuccess())
  }
}

function* getUserOrganizationLogo({payload}) {
  try {
    const logoBase64 = yield call(organizationApi.getOrganizationLogo, payload);
    yield put(getUserOrganizationLogoSuccess(logoBase64))

  } catch (error) {
    yield put(getUserOrganizationLogoError(error))
  }
}

function* getOnboardingsByUser({payload}) {
  try {
    const onboardings = yield call(userApi.getOnboradingsByUser, payload);
    yield put(getOnboardingsByUserSuccess({user: payload, onboardings}));
  } catch (error) {
    yield put(getOnboardingsByUserError(error));
  }
}

function* handleSetManager({payload}) {

  yield put(getOnboardingsByUserRequest(payload))
}

export default function* () {
  yield all([
    yield takeLatest(getOnboardingsByUserRequest.type, getOnboardingsByUser),
    yield takeLatest(getProfileRequest.type, getProfile),
    yield takeLatest(getUsersRequest.type, getUsers),
    yield takeLatest(getFilterRequest.type, getFilter),
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
    yield takeLatest(allowUserAbilityRequest.type, allowUserAbility),
    yield takeLatest(disallowUserAbilityRequest.type, disallowUserAbility),
    yield takeLatest(removeUserNotifyRequest.type, removeUserNotify),
    yield takeLatest(getUserOrganizationLogoRequest.type, getUserOrganizationLogo),
    yield takeLatest(setManager.type, handleSetManager),
  ]);
}
