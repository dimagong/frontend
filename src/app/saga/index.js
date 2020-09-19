import { all } from "redux-saga/effects";

import authSagas from "./auth/authSagas";
import notificationSagas from "./onboarding/notification/notificationSagas";
import userSagas from "./user/userSagas";
import groupSagas from "./group/groupSagas";


export default function *rootSaga() {
  yield all([
    authSagas(),
    notificationSagas(),
    userSagas(),
    groupSagas()
  ]);
}
