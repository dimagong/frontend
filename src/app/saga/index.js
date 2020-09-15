import { all } from "redux-saga/effects";

// import authSagas from "./auth/authSagas";
import authSagas from "./auth/authSagas";


export default function *rootSaga() {
  yield all([
    authSagas(),
  ]);
}
