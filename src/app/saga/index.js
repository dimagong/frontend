import { all } from "redux-saga/effects";

import authSagas from "./auth/authSagas";
import notificationSagas from "./onboarding/notification/notificationSagas";
import dFromSagas from "./onboarding/dForm/dFromSagas";
import userSagas from "./user";
import groupSagas from "./group/groupSagas";
import workflowSagas from "./onboarding/workflow/workflowSagas";
import roleSagas from './role/roleSagas'
import moduleSagas from './module/moduleSagas'
import masterSchemaSagas from './masterSchema/masterSchemaSagas'
import layoutSaga from './layout'
import surveysSaga from './surveys'

export default function *rootSaga() {
  yield all([
    authSagas(),
    notificationSagas(),
    userSagas(),
    groupSagas(),
    dFromSagas(),
    workflowSagas(),
    roleSagas(),
    moduleSagas(),
    layoutSaga(),
    masterSchemaSagas(),
    surveysSaga(),
  ]);
}
