import { all } from "redux-saga/effects";

import invitationsSagas from "./invitationsSagas";
import onboardingSagas from "./onboardingSagas";
import userSagas from "./userSagas";

export default function* () {
  yield all([invitationsSagas(), onboardingSagas(), userSagas()]);
}
