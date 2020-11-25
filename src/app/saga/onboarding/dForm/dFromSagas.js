import {all, put, call, takeLatest, select} from "redux-saga/effects";

import dFormApi from "api/Onboarding/dForms";
import {
  getdFormsRequest,
  getdFormsSuccess,
  getdFormsError,
  createDFormTemplateSuccess,
  createDFormTemplateRequest,
  createDFormTemplateError,
  updateDFormTemplateSuccess,
  updateDFormTemplateRequest,
  updateDFormRequest,
  updateDFormError,
  updateDFormTemplateError,
  deletedFormSuccess,
  deletedFormRequest,
  deletedFormError,
  getdFormActionsSuccess,
  getdFormActionsRequest,
  getdFormActionsError,
  getdFormTriggersSuccess,
  getdFormTriggersRequest,
  getdFormTriggersError,
  submitdFormSuccess,
  submitdFormRequest,
  submitdFormError,
  submitdFormDataSuccess,
  submitdFormDataRequest,
  submitdFormDataError,
  changedFormStatusSuccess,
  changedFormStatusRequest,
  changedFormStatusError,
} from "app/slices/appSlice";
import {setdForms, setdFormActions, setdFormTriggers} from "app/slices/onboardingSlice";
import {prepareSelectGroups} from "utility/select/prepareSelectData";
import {selectdForms} from "app/selectors/onboardingSelectors";
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

function* submitdFormData({payload}) {
  try {
    const responce = yield call(dFormApi.submitdFormData, payload);
    yield put(submitdFormDataSuccess(responce));
  } catch (error) {
    console.log(error);
    yield put(submitdFormDataError(error));
  }
}

function* submitdForm({payload}) {
  try {
    const responce = yield call(dFormApi.submitdForm, payload);
    yield put(submitdFormSuccess(responce));
  } catch (error) {
    console.log(error);
    yield put(submitdFormError(error));
  }
}

function* changedFormStatus({payload}) {
  try {
    const responce = yield call(dFormApi.changedFormStatus, payload);
    yield put(changedFormStatusSuccess(responce));
  } catch (error) {
    yield put(changedFormStatusError(error));
  }
}


function* createDForm({payload}) {
  try {
    const responce = yield call(dFormApi.createdForm, {
      ...payload,
    });

    yield put(createDFormTemplateSuccess());
  } catch (error) {
    yield put(createDFormTemplateError(error));
  }
}

// todo only fo dFormTemplate
function* updateDForm({payload}) {
  try {
    const responce = yield call(dFormApi.updateDForm, {
      ...payload,
    });
    yield put(updateDFormTemplateSuccess());
  } catch (error) {
    console.log(error);
    yield put(updateDFormTemplateError(error));
  }
}

function* createDFormTemplate({payload}) {
  try {
    const responce = yield call(dFormApi.createDFormTemplate, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map((group) => group.value),
    });

    yield put(createDFormTemplateSuccess());
    const notifications = yield select(selectdForms);
    yield put(setdForms([...notifications, responce]));
  } catch (error) {
    yield put(createDFormTemplateError(error));
  }
}

// todo only for dFormTemplate
function* updateDFormTemplate({payload}) {
  try {
    const responce = yield call(dFormApi.updateDFormTemplate, {
      ...payload,
      groups: prepareSelectGroups(payload.groups).map((group) => group.value),
    });
    yield put(updateDFormTemplateSuccess());
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
    yield put(updateDFormTemplateError(error));
  }
}

function* deleteDFormTemplate({payload}) {
  try {
    yield call(dFormApi.deleteDFormTemplate, payload);
    yield put(deletedFormSuccess());
    const dForm = yield select(selectdForms);
    yield put(
      setdForms(
        dForm.filter((notification) => notification.id !== payload.id)
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
    yield takeLatest(createDFormTemplateRequest.type, createDFormTemplate),
    yield takeLatest(updateDFormTemplateRequest.type, updateDFormTemplate),
    yield takeLatest(updateDFormRequest.type, updateDForm),
    yield takeLatest(deletedFormRequest.type, deleteDFormTemplate),
    yield takeLatest(getdFormActionsRequest.type, getdFormActions),
    yield takeLatest(getdFormTriggersRequest.type, getdFormTriggers),
    yield takeLatest(submitdFormDataRequest.type, submitdFormData),
    yield takeLatest(submitdFormRequest.type, submitdForm),
    yield takeLatest(changedFormStatusRequest.type, changedFormStatus),
  ]);
}
