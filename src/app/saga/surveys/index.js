import { all, put, call, takeLatest, takeEvery } from "redux-saga/effects";

import surveysApi from "api/surveys";

import appSlice from 'app/slices/appSlice';

const {
  setContext,

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

  getSurveyVersionsSuccess,
  getSurveyVersionsRequest,
  getSurveyVersionsError,

  deleteSurveySuccess,
  deleteSurveyRequest,
  deleteSurveyError,

  deleteSurveyLatestVersionSuccess,
  deleteSurveyLatestVersionRequest,
  deleteSurveyLatestVersionError,

  deleteSurveyVersionSuccess,
  deleteSurveyVersionRequest,
  deleteSurveyVersionError,

  getSurveyWorkFlowsAndReviewersSuccess,
  getSurveyWorkFlowsAndReviewersRequest,
  getSurveyWorkFlowsAndReviewersError,

  assignSurveySuccess,
  assignSurveyRequest,
  assignSurveyError,

  getAssignedSurveysSuccess,
  getAssignedSurveysRequest,
  getAssignedSurveysError,

  getAssignedSurveysForOnboardingSuccess,
  getAssignedSurveysForOnboardingRequest,
  getAssignedSurveysForOnboardingError,

  getCurrentQuestionForAssignedSurveySuccess,
  getCurrentQuestionForAssignedSurveyRequest,
  getCurrentQuestionForAssignedSurveyError,

  beginSurveySuccess,
  beginSurveyRequest,
  beginSurveyError,

  pushAnswerSuccess,
  pushAnswerRequest,
  pushAnswerError,

  gradeSurveyQuestionAnswerSuccess,
  gradeSurveyQuestionAnswerRequest,
  gradeSurveyQuestionAnswerError,

  finishGradingSuccess,
  finishGradingRequest,
  finishGradingError,

  deleteAssignedSurveySuccess,
  deleteAssignedSurveyRequest,
  deleteAssignedSurveyError,

  switchToPreviousQuestionSuccess,
  switchToPreviousQuestionRequest,
  switchToPreviousQuestionError,

  addFeedbackToQuestionSuccess,
  addFeedbackToQuestionRequest,
  addFeedbackToQuestionError,

  getAllSurveyQuestionsSuccess,
  getAllSurveyQuestionsRequest,
  getAllSurveyQuestionsError,
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

function* getSurveyVersions(payload) {
  const response = yield call(surveysApi.getSurveyVersions, payload);

  if (response?.message) {
    yield put(getSurveyVersionsError(response.message))
  } else {
    yield put(getSurveyVersionsSuccess(response))
  }
}

function* deleteSurvey(payload) {
  const response = yield call(surveysApi.deleteSurveyVersion, payload);

  if (response?.message) {
    yield put(deleteSurveyError(response.message))
  } else {

    yield put(setContext(null));
    yield put(deleteSurveySuccess(payload))
  }
}

function* deleteSurveyLatestVersion(payload) {
  const response = yield call(surveysApi.deleteSurveyVersion, payload);

  if (response?.message) {
    yield put(deleteSurveyLatestVersionError(response.message));
  } else {
    yield put(deleteSurveyLatestVersionSuccess())
  }
}

function* deleteSurveyVersion(payload) {
  const response = yield call(surveysApi.deleteSurveyVersion, payload);

  if (response?.message) {
    yield put(deleteSurveyVersionError(response.message));
  } else {
    yield put(deleteSurveyVersionSuccess(payload))
  }
}

function* getSurveyWorkFlowsAndReviewers() {
  const response = yield call(surveysApi.getSurveyWorkFlowsAndReviewers);

  if (response?.message) {
    yield put(getSurveyWorkFlowsAndReviewersError(response.message));
  } else {
    yield put(getSurveyWorkFlowsAndReviewersSuccess(response))
  }
}

function* assignSurvey(payload) {
  const response = yield call(surveysApi.assignNewSurvey, payload);

  if (response?.message) {
    yield put(assignSurveyError(response.message));
  } else {
    yield put(assignSurveySuccess(response))
  }
}

function* getAssignedSurveys(payload) {
  const response = yield call(surveysApi.getAssignedSurveys, payload);

  if (response?.message) {
    yield put(getAssignedSurveysError(response.message));
  } else {
    yield put(getAssignedSurveysSuccess(response))
  }
}

function* getAssignedSurveysForOnboarding() {
  const response = yield call(surveysApi.getAssignedSurveysForOnboarding);

  if (response?.message) {
    yield put(getAssignedSurveysForOnboardingError(response.message));
  } else {
    yield put(getAssignedSurveysForOnboardingSuccess(response))
  }
}

function* getCurrentQuestionForAssignedSurvey(payload) {
  const response = yield call(surveysApi.getCurrentQuestionForAssignedSurvey, payload);

  if (response?.message) {
    yield put(getCurrentQuestionForAssignedSurveyError(response.message))
  } else {
    yield put(getCurrentQuestionForAssignedSurveySuccess(response))
  }
}

function* beginSurvey(payload) {
  const response = yield call(surveysApi.beginSurvey, payload);

  if (response?.message) {
    yield put(beginSurveyError(response.message))
  } else {

    yield put(getCurrentQuestionForAssignedSurveyRequest(payload.payload));

    yield put(beginSurveySuccess(response))
  }
}

function* pushAnswer(payload) {
  const response = yield call(surveysApi.pushSurveyQuestionAnswer, payload);

  if (response?.message) {
    yield put(pushAnswerError(response.message))
  } else {
    yield put(getCurrentQuestionForAssignedSurveyRequest(payload.payload.surveyId));
    yield put(pushAnswerSuccess())
  }
}

function* gradeSurveyQuestionAnswer(payload) {
  const response = yield call(surveysApi.gradeSurveyQuestionAnswer, payload);

  if (response?.message) {
    yield put(gradeSurveyQuestionAnswerError(response.message))
  } else {
    yield put(gradeSurveyQuestionAnswerSuccess(response))
  }
}

function* finishGrading(payload) {
  const response = yield call(surveysApi.finishGrading, payload);

  if (response?.message) {
    yield put(finishGradingError(response.message))
  } else {
    yield put(finishGradingSuccess(response))
  }
}

function* deleteAssignedSurvey({ payload }) {
  const response = yield call(surveysApi.deleteAssignedSurvey, payload);

  if (response?.message) {
    yield put(deleteAssignedSurveyError(response.message))
  } else {
    yield put(deleteAssignedSurveySuccess(payload))
  }
}

function* switchToPreviousQuestion({ payload }) {
  const response = yield call(surveysApi.switchToPreviousQuestion, payload);

  if (response?.message) {
    yield put(switchToPreviousQuestionError(response.message))
  } else {
    yield put(switchToPreviousQuestionSuccess(response))
  }
}

function* addFeedbackToQuestion(payload) {
  const response = yield call(surveysApi.addFeedbackToQuestion, payload);

  if (response?.message) {
    yield put(addFeedbackToQuestionError(response.message))
  } else {
    yield put(addFeedbackToQuestionSuccess(response))
  }
}

function* getAllSurveyQuestions({ payload }) {
  const response = yield call(surveysApi.getAllSurveyQuestions, payload);

  if (response?.message) {
    yield put(getAllSurveyQuestionsError(response.message))
  } else {
    yield put(getAllSurveyQuestionsSuccess({data: response, id: payload}))
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
    yield takeLatest(deleteQuestionRequest.type, deleteQuestion),
    yield takeLatest(getSurveyVersionsRequest.type, getSurveyVersions),
    yield takeLatest(deleteSurveyRequest.type, deleteSurvey),
    yield takeLatest(deleteSurveyLatestVersionRequest.type, deleteSurveyLatestVersion),
    yield takeLatest(deleteSurveyVersionRequest.type, deleteSurveyVersion),
    yield takeLatest(getSurveyWorkFlowsAndReviewersRequest.type, getSurveyWorkFlowsAndReviewers),
    yield takeLatest(assignSurveyRequest.type, assignSurvey),
    yield takeLatest(getAssignedSurveysRequest.type, getAssignedSurveys),
    yield takeLatest(getAssignedSurveysForOnboardingRequest.type, getAssignedSurveysForOnboarding),
    yield takeLatest(getCurrentQuestionForAssignedSurveyRequest.type, getCurrentQuestionForAssignedSurvey),
    yield takeLatest(beginSurveyRequest.type, beginSurvey),
    yield takeLatest(pushAnswerRequest.type, pushAnswer),
    yield takeEvery(gradeSurveyQuestionAnswerRequest.type, gradeSurveyQuestionAnswer),
    yield takeLatest(finishGradingRequest.type, finishGrading),
    yield takeLatest(deleteAssignedSurveyRequest.type, deleteAssignedSurvey),
    yield takeLatest(switchToPreviousQuestionRequest.type, switchToPreviousQuestion),
    yield takeLatest(addFeedbackToQuestionRequest.type, addFeedbackToQuestion),
    yield takeLatest(getAllSurveyQuestionsRequest.type, getAllSurveyQuestions),
  ]);
}
