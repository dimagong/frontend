import { all, put, call, takeLatest, select } from "redux-saga/effects";

import dFormApi from "api/Onboarding/dForms";
import {
  getdFormsRequest,
  getdFormsSuccess,
  getdFormsError,
  createdFormSuccess,
  createdFormRequest,
  createdFormError,
  updatedFormSuccess,
  updatedFormRequest,
  updatedFormError,
  deletedFormSuccess,
  deletedFormRequest,
  deletedFormError,
  getdFormActionsSuccess,
  getdFormActionsRequest,
  getdFormActionsError,
  getdFormTriggersSuccess,
  getdFormTriggersRequest,
  getdFormTriggersError,
} from "app/slices/appSlice";
import { setdForms, setdFormActions, setdFormTriggers } from "app/slices/onboardingSlice";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { selectdForms } from "app/selectors/onboardingSelectors";
import _ from "lodash";

function* getdForms() {
  try {
    const responce = yield call(dFormApi.getdForms);

    yield put(getdFormsSuccess());
    yield put(setdForms(responce));
  } catch (error) {
    yield put(getdFormsError(error));
  }
}

function* createdForm({ payload }) {
  try {
    const responce = yield call(dFormApi.createdForm, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map((group) => group.value),
    });

    yield put(createdFormSuccess());
    const notifications = yield select(selectdForms);
    yield put(setdForms([...notifications, responce]));
  } catch (error) {
    yield put(createdFormError(error));
  }
}

function* updatedForm({ payload }) {
  try {
    const responce = yield call(dFormApi.updatedForm, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map((group) => group.value),
    });
    yield put(updatedFormSuccess());
    const notifications = yield select(selectdForms);
    yield put(
      setdForms(
        notifications.map((notification) =>
          notification.id === responce.id ? responce : notification
        )
      )
    );
  } catch (error) {
    console.log(error);
    yield put(updatedFormError(error));
  }
}

function* deletedForm({ payload }) {
  try {
    yield call(dFormApi.deletedForm, payload);
    yield put(deletedFormSuccess());
    const notifications = yield select(selectdForms);
    yield put(
      setdForms(
        notifications.filter((notification) => notification.id !== payload.id)
      )
    );
  } catch (error) {
    console.log(error);
    yield put(deletedFormError(error));
  }
}

function* getdFormActions() {
  try {
    const responce = yield call(dFormApi.getdFormActions);
    yield put(getdFormActionsSuccess());
    yield put(setdFormActions(responce))
  } catch (error) {
    console.log(error);
    yield put(getdFormActionsError());
  }
}

function* getdFormTriggers() {
  try {
    const responce = yield call(dFormApi.getdFormTriggers);
    yield put(getdFormTriggersSuccess());
    yield put(setdFormTriggers(responce))
  } catch (error) {
    console.log(error);
    yield put(getdFormTriggersError());
  }
}

export default function* () {
  yield all([
    yield takeLatest(getdFormsRequest.type, getdForms),
    yield takeLatest(createdFormRequest.type, createdForm),
    yield takeLatest(updatedFormRequest.type, updatedForm),
    yield takeLatest(deletedFormRequest.type, deletedForm),
    yield takeLatest(getdFormActionsRequest.type, getdFormActions),
    yield takeLatest(getdFormTriggersRequest.type, getdFormTriggers),
  ]);
}
