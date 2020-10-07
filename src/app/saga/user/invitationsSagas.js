import { all, put, call, takeLatest } from "redux-saga/effects";

import userApi from "api/User/user";
import {
  getInvitationsSuccess,
  getInvitationsRequest,
  getInvitationsError,
  createInvitationsSuccess,
  createInvitationsRequest,
  createInvitationsError,
  deleteInvitationsSuccess,
  deleteInvitationsRequest,
  deleteInvitationsError,
  revokeInvitationsSuccess,
  revokeInvitationsRequest,
  revokeInvitationsError,
  getInvitationSuccess,
  getInvitationRequest,
  getInvitationError,
  sendInvitationAcceptSuccess,
  sendInvitationAcceptRequest,
  sendInvitationAcceptError,
} from "app/slices/appSlice";

function* getInvitations() {
    try {
      const user = yield call(userApi.getInvitations);
      yield put(getInvitationsSuccess(user));
  
    } catch (error) {
      yield put(getInvitationsError(error));
    }
  }

  function* createInvitations(payload) {
    try {
      const user = yield call(userApi.createInvitations, payload  );
      yield put(createInvitationsSuccess(user));
  
    } catch (error) {
      yield put(createInvitationsError(error));
    }
  }

  function* deleteInvitations(payload) {
    try {
      yield call(userApi.deleteInvitations, payload  );
      yield put(deleteInvitationsSuccess(payload));
  
    } catch (error) {
      yield put(deleteInvitationsError(error));
    }
  }

  function* revokeInvitations(payload) {
    try {
      const invitation = yield call(userApi.revokeInvitations, payload  );
      yield put(revokeInvitationsSuccess(invitation));
  
    } catch (error) {
      console.log(error)
      yield put(revokeInvitationsError(error));
    }
  }

  function* getInvitation(payload) {
    try {
      const invitation = yield call(userApi.getInvitation, payload  );
      yield put(getInvitationSuccess(invitation));
  
    } catch (error) {
      console.log(error)
      yield put(getInvitationError(error));
    }
  }

  function* sendInvitationAccept({payload}) {
    try {
      yield call(userApi.sendInvitationAccept, payload);
      yield put(sendInvitationAcceptSuccess());
  
    } catch (error) {
      console.log(error)
      yield put(sendInvitationAcceptError(error));
    }
  }
  
  export default function* () {
    yield all([
        yield takeLatest(getInvitationsRequest.type, getInvitations),
        yield takeLatest(createInvitationsRequest.type, createInvitations),
        yield takeLatest(deleteInvitationsRequest.type, deleteInvitations),
        yield takeLatest(revokeInvitationsRequest.type, revokeInvitations),
        yield takeLatest(getInvitationRequest.type, getInvitation),
        yield takeLatest(sendInvitationAcceptRequest.type, sendInvitationAccept),
    ]);
  }