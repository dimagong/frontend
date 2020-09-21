import { all } from "redux-saga/effects";

import authSagas from "./auth/authSagas";
import notificationSagas from "./onboarding/notification/notificationSagas";
import dFromSagas from "./onboarding/dForm/dFromSagas";
import userSagas from "./user/userSagas";
import groupSagas from "./group/groupSagas";
import workflowSagas from "./onboarding/workflow/workflowSagas";


export default function *rootSaga() {
  yield all([
    authSagas(),
    notificationSagas(),
    userSagas(),
    groupSagas(),
    dFromSagas(),
    workflowSagas(),
  ]);
}
