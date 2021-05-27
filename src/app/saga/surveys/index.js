import { all, put, call, takeLatest } from "redux-saga/effects";

import surveysApi from "api/surveys";

import appSlice from 'app/slices/appSlice';

const {
  getSurveysSuccess,
  getSurveysRequest,
  getSurveysError,

  createSurveySuccess,
  createSurveyRequest,
  createSurveyError,

  createFolderSuccess,
  createFolderRequest,
  createFolderError,

  getFoldersSuccess,
  getFoldersRequest,
  getFoldersError,

  createQuestionSuccess,
  createQuestionRequest,
  createQuestionError,

  updateQuestionSuccess,
  updateQuestionRequest,
  updateQuestionError,

  getSurveySuccess,
  getSurveyRequest,
  getSurveyError,

  updateSurveySuccess,
  updateSurveyRequest,
  updateSurveyError,

  deleteFolderSuccess,
  deleteFolderRequest,
  deleteFolderError,

  getSelectedQuestionVersionsSuccess,
  getSelectedQuestionVersionsRequest,
  getSelectedQuestionVersionsError,

  deleteQuestionVersionSuccess,
  deleteQuestionVersionRequest,
  deleteQuestionVersionError,

  deleteLatestQuestionVersionSuccess,
  deleteLatestQuestionVersionRequest,
  deleteLatestQuestionVersionError,

  deleteQuestionSuccess,
  deleteQuestionRequest,
  deleteQuestionError,
}  = appSlice.actions;

function* getSurveys() {
  const response = yield call(surveysApi.getSurveys);

  if (response?.message) {
    yield put(getSurveysError(response.message))
  } else {
    yield put(getSurveysSuccess(response))
  }
}

function* createSurvey(payload) {
  const response = yield call(surveysApi.createSurvey, payload);

  if (response?.message) {
    yield put(createSurveyError(response.message))
  } else {
    yield put(createSurveySuccess(response))
  }
}

function* createFolder(payload) {
  const response = yield call(surveysApi.createFolder, payload);

  if (response?.message) {
    yield put(createFolderError(response.message))
  } else {
    yield put(createFolderSuccess(response))
  }
}

function* getFolders() {
  const response = yield call(surveysApi.getFolders);

  if(response?.message) {
    yield put(getFoldersError(response.message))
  } else {
    yield put(getFoldersSuccess(response))
  }
}

function* createQuestion(payload) {
  const response = yield call(surveysApi.createQuestion, payload);

  if(response?.message) {
    yield put(createQuestionError(response.message))
  } else {
    yield put(createQuestionSuccess({response, folderId: payload.payload.folder_id}))
  }
}

function* updateQuestion(payload) {
  const response = yield call(surveysApi.updateQuestion, payload);

  if(response?.message) {
    yield put(updateQuestionError(response.message))
  } else {
    yield put(updateQuestionSuccess({response, folderId: payload.payload.data.folder_id}))
  }
}

function* getSurvey(payload) {
  const response = yield call(surveysApi.getSurvey, payload);

  if(response?.message) {
    yield put(getSurveyError(response.message))
  } else {
    yield put(getSurveySuccess(response))
  }
}

function* updateSurvey(payload) {
  const response = yield call(surveysApi.updateSurvey, payload);

  if(response?.message) {
    yield put(updateSurveyError(response.message))
  } else {
    yield put(updateSurveySuccess(response))
  }
}

function* deleteFolder(payload) {
  const response = yield call(surveysApi.deleteFolder, payload);

  if (response?.message) {
    yield put(deleteFolderError(response.message))
  } else {
    yield put(deleteFolderSuccess(payload))
  }
}

function* getSelectedQuestionVersions(payload) {
  const response = yield call(surveysApi.getQuestionVersions, payload);

  if (response?.message) {
    yield put(getSelectedQuestionVersionsError(response.message))
  } else {
    yield put(getSelectedQuestionVersionsSuccess(response))
  }
}

function* deleteQuestionVersion(payload) {
  const response = yield call(surveysApi.deleteQuestionVersion, payload);

  if (response?.message) {
    yield put(deleteQuestionVersionError(response.message))
  } else {
    yield put(deleteQuestionVersionSuccess(payload))
  }
}

function* deleteLatestQuestionVersion(payload) {
  const response = yield call(surveysApi.deleteQuestionVersion, {payload: payload.payload.questionVersion});

  if (response?.message) {
    yield put(deleteLatestQuestionVersionError(response.message));
  } else {
    const newVersions = yield call(surveysApi.getQuestionVersions, {payload: payload.payload.questionId});

    if (newVersions?.message) {
      yield put(deleteLatestQuestionVersionError(response.message))
    } else {
      yield put(deleteLatestQuestionVersionSuccess({newVersions, folderId: payload.payload.folderId}))
    }
  }
}

function* deleteQuestion(payload) {
  const response = yield call(surveysApi.deleteQuestionVersion, {payload: payload.payload.questionVersion});

  if (response?.message) {
    yield put(deleteQuestionError(response.message))
  } else {
    yield put(deleteQuestionSuccess({folderId: payload.payload.folderId, questionId: payload.payload.questionId}))
  }
}

export default function* () {
  yield all([
    yield takeLatest(getSurveysRequest.type, getSurveys),
    yield takeLatest(createSurveyRequest.type, createSurvey),
    yield takeLatest(createFolderRequest.type, createFolder),
    yield takeLatest(getFoldersRequest.type, getFolders),
    yield takeLatest(createQuestionRequest.type, createQuestion),
    yield takeLatest(updateQuestionRequest.type, updateQuestion),
    yield takeLatest(getSurveyRequest.type, getSurvey),
    yield takeLatest(updateSurveyRequest.type, updateSurvey),
    yield takeLatest(deleteFolderRequest.type, deleteFolder),
    yield takeLatest(getSelectedQuestionVersionsRequest.type, getSelectedQuestionVersions),
    yield takeLatest(deleteQuestionVersionRequest.type, deleteQuestionVersion),
    yield takeLatest(deleteLatestQuestionVersionRequest.type, deleteLatestQuestionVersion),
    yield takeLatest(deleteQuestionRequest.type, deleteQuestion)
  ]);
}
