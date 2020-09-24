import { all, put, call, takeLatest, select } from "redux-saga/effects";

import workflowApi from "api/Onboarding/workflow";
import {
  getWorkflowsRequest,
  getWorkflowsSuccess,
  getWorkflowsError,
  createWorkflowSuccess,
  createWorkflowRequest,
  createWorkflowError,
  updateWorkflowSuccess,
  updateWorkflowRequest,
  updateWorkflowError,
  deleteWorkflowSuccess,
  deleteWorkflowRequest,
  deleteWorkflowError,
  getdFormActionsRequest,
  getdFormTriggersRequest,
  getNotificationsRequest
} from "app/slices/appSlice";
import {
  setWorkflows
} from "app/slices/onboardingSlice";
import {prepareSelectData} from "utility/select/prepareSelectData";
import {
  selectWorkflows,
  selectNotifications
} from "app/selectors/onboardingSelectors";


function* getWorkflows() {
  try {
    const responce = yield call(workflowApi.getWorkflows);
    
    yield put(getWorkflowsSuccess());
    yield put(setWorkflows(responce))
    yield put(getdFormActionsRequest())
    yield put(getdFormTriggersRequest())
    const notifications = yield select(selectNotifications);
    if(!notifications.length){
      yield put(getNotificationsRequest())
    }

  } catch (error) {
    yield put(getWorkflowsError(error));
  }
}

function* createWorkflow({payload}) {
  try {
    const responce = yield call(workflowApi.createWorkflow, {...payload, groups: prepareSelectData(payload.groups).map(group => group.value)});
    
    yield put(createWorkflowSuccess());
    const notifications = yield select(selectWorkflows)
    yield put(setWorkflows([...notifications, responce]))
  } catch (error) {
    yield put(createWorkflowError(error));
  }
}

function* updateWorkflow({payload}) {
  try {
    const responce = yield call(workflowApi.updateWorkflow, {...payload, groups: prepareSelectData(payload.groups).map(group => group.value)});
    yield put(updateWorkflowSuccess());
    const notifications = yield select(selectWorkflows);
    yield put(setWorkflows(notifications.map( notification => notification.id === responce.id ? responce : notification)))
  } catch (error) {
    console.log(error)
    yield put(updateWorkflowError(error));
  }
}

function* deleteWorkflow({payload}) {
  try {
    yield call(workflowApi.deleteWorkflow, payload);
    yield put(deleteWorkflowSuccess());
    const notifications = yield select(selectWorkflows);
    yield put(setWorkflows(notifications.filter( notification => notification.id !== payload.id )))
  } catch (error) {
    console.log(error)
    yield put(deleteWorkflowError(error));
  }
}





export default function* () {
  yield all([
    yield takeLatest(getWorkflowsRequest.type, getWorkflows),
    yield takeLatest(createWorkflowRequest.type, createWorkflow),
    yield takeLatest(updateWorkflowRequest.type, updateWorkflow),
    yield takeLatest(deleteWorkflowRequest.type, deleteWorkflow),
  ]);
}
