import { all, put, call, takeLatest, select, takeEvery } from "redux-saga/effects";

import userApi from "api/User/user";
import {
  getProfileSuccess,
  getProfileRequest,
  getProfileError,
  getUsersSuccess,
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
} from "app/slices/appSlice";
import {loginWithJWT} from "app/actions/vuexy/auth/loginActions"
import {prepareSelectGroups} from "utility/select/prepareSelectData";
import { selectGroups, selectRoles } from "app/selectors";

function* getProfile() {
  try {
    const responce = yield call(userApi.getProfile);

    yield put(getProfileSuccess(responce));
    yield put(loginWithJWT(responce))

  } catch (error) {
    console.log(error)
    yield put(getProfileError(error));
  }
}

function* getUsers() {

    const responce = yield call(userApi.getUsers);

    yield put(getUsersSuccess(responce));


}

function* getUserById({payload}) {
  try {
    const responce = yield call(userApi.getUserById, payload);

    yield put(getUserByIdSuccess(responce));

  } catch (error) {
    console.log(error)
    yield put(getUserByIdError(error));
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


function* createUser({payload}) {
  try {
    const user = yield call(userApi.createUser, {...payload, groups: prepareSelectGroups(payload.groups).map(group => group.value)});
    yield put(createUserSuccess(user));

  } catch (error) {
    console.log(error)
    yield put(createUserError(error));
  }
}

function* getUserManagmentData() {
  const groups = yield select(selectGroups)
  const roles = yield select(selectRoles)
  try {
    const responce = yield call(userApi.getUsers);
    yield put(getUsersSuccess(responce));

    if(!groups.length){
      yield put(getGroupsRequest())
    }
    if(!roles.length){
      yield put(getRolesRequest())
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
    yield put(getUserOrganizationsSuccess(response))
  }
}

function* addUserOrganization({payload}) {
  const response = yield call(userApi.addUserOrganization, payload)

  if (response?.message) {
    yield put(addUserOrganizationError(response.message))
  } else {
    yield put(addUserOrganizationSuccess(response))
  }
}

function* removeUserOrganization({payload}) {
  const response = yield call(userApi.removeUserOrganization, payload)

  if (response?.message) {
    yield put(removeUserOrganizationError(response.message))
  } else {
    yield put(removeUserOrganizationSuccess(payload))
  }
}

function* allowUserAbility({payload}) {
  const response = yield call(userApi.userAbilityAllow, payload)

  if (response?.message) {
    yield put(allowUserAbilityError(response.message))
  } else {
    yield put(allowUserAbilitySuccess({response, data: payload}))
  }
}

function* disallowUserAbility({payload}) {
  const response = yield call(userApi.userAbilityDisallow, payload)

  if (response?.message) {
    yield put(disallowUserAbilityError(response.message))
  } else {
    yield put(disallowUserAbilitySuccess({response, data: payload}))
  }



}

export default function* () {
  yield all([
    yield takeLatest(getProfileRequest.type, getProfile),
    yield takeLatest(getUsersRequest.type, getUsers),
    yield takeLatest(getUserByIdRequest.type, getUserById),
    yield takeLatest(updateUserRequest.type, updateUser),
    yield takeLatest(createUserRequest.type, createUser),
    yield takeEvery(getUserManagment.type, getUserManagmentData),
    yield takeLatest(getUserOrganizationsRequest.type, getUserOrganizations),
    yield takeLatest(addUserOrganizationRequest.type, addUserOrganization),
    yield takeLatest(removeUserOrganizationRequest.type, removeUserOrganization),
    yield takeLatest(allowUserAbilityRequest.type, allowUserAbility),
    yield takeLatest(disallowUserAbilityRequest.type, disallowUserAbility)
  ]);
}
