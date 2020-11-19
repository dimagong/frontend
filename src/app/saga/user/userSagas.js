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
  try {
    const response = yield call(userApi.getUserOrganizations, userId);

    yield put(getUserOrganizationsSuccess(response))
  } catch (err) {
    yield put(getUserOrganizationsError(err))
    throw err;
  }
}

function* addUserOrganization({payload}) {
  try {
    const response = yield call(userApi.addUserOrganization, payload)

    yield put(addUserOrganizationSuccess(response))
  } catch (err) {
    yield put(addUserOrganizationError(err))
    throw err;
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
    yield takeLatest(addUserOrganizationRequest.type, addUserOrganization)
  ]);
}
