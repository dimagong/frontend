export const surveysGetUrl = "api/survey-interaction";
export const surveysCreateUrl = "api/survey-interaction";
export const addFolder = "api/survey-folder";
export const getFolders = "api/survey-folder";
export const createQuestion = "api/survey-question";
export const getQuestionUpdateUrl = (questionVersionId) => `api/survey-question/${questionVersionId}`;
export const getSurveyUrl = (surveyId) => `api/survey-interaction/${surveyId}`;
export const getSurveyUpdateUrl = (surveyId) => `api/survey-interaction/${surveyId}`;
export const getFolderDeleteUrl = (folderId) => `api/survey-folder/${folderId}`;
export const getQuestionVersionsFetchUrl = (questionId) => `api/survey-question/${questionId}/versions`;
export const getQuestionVersionDeleteUrl = (questionVersionId) => `api/survey-question-version/${questionVersionId}`;
export const getSurveyVersionsFetchUrl = (surveyId) => `api/survey-interaction/${surveyId}/versions`;
export const getSurveyVersionDeleteUrl = (versionId) => `api/survey-interaction-version/${versionId}`;
export const getSurveyWorkFlowsAndReviewersUrl = "api/survey-assigned-interaction/relations";
export const assignSurvey = `api/survey-assigned-interaction`;
export const getAssignedSurveysGetUrl = (userId) => `api/survey-assigned-interaction/${userId}`;
export const getAssignedSurveysForOnboarding = "api/survey-passing";
export const getBeginSurveyUrl = (assignedSurveyId) => `api/survey-passing/${assignedSurveyId}/begin`;
export const getCurrentQuestionForAssignedSurveyUrl = (assignedSurveyId) =>
  `api/survey-passing/${assignedSurveyId}/current-question`;
export const getSurveyAnswerPushUrl = (assignedSurveyId) => `api/survey-passing/${assignedSurveyId} `;
export const getGradeSurveyQuestionAnswerUrl = (assignedSurveyId) =>
  `api/survey-assigned-interaction/${assignedSurveyId}/update-grade`;
export const getFinishGradingUrl = (assignedSurveyId) =>
  `api/survey-assigned-interaction/${assignedSurveyId}/finish-grade`;
export const getDeleteAssignedSurveyUrl = (assignedInteractionId) =>
  `api/survey-assigned-interaction/${assignedInteractionId}`;
export const getSwitchToPreviousQuestionUrl = (assignedInteractionId) =>
  `api/survey-passing/${assignedInteractionId}/make-previous-question-current`;
export const addFeedbackToQuestionUrl = (assignedInteractionId) =>
  `api/survey-assigned-interaction/${assignedInteractionId}/feedback`;
export const getAllSurveyQuestionUrl = (assignedInteractionId) =>
  `api/survey-passing/${assignedInteractionId}/questions`;
export const getSurveyByIdUrl = (assignedSurveyId) => `api/survey-passing/${assignedSurveyId}`;
export const updateSurveyMainDataUrl = (surveyVersionId) =>
  `api/survey-interaction/${surveyVersionId}/with-previous-questions`;
