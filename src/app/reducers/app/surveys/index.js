import { getIndexById } from "utility/common";

import { toast } from "react-toastify";

const surveysReducer = {
  getSurveysSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.error = null;
    state.surveys = payload;
  },

  createSurveySuccess: (state, { payload }) => {
    state.surveys = [...state.surveys, payload];
    state.isLoading = false;
    state.error = null;

  },

  getSurveySuccess: (state, { payload }) => {

    const survey = payload;
    survey.latest_version.latest_questions = survey.latest_version.latest_questions.map((question, index) => {
      const temp = {...question};

      temp.latest_version.question.order = index;

      return temp;
    });
    state.selectedSurvey = payload;
    state.isLoading = false;
    state.error = null;
  },

  createFolderSuccess: (state, { payload }) => {
    state.folders = [...state.folders, {...payload, questions: []}];
    state.isLoading = false;
    state.error = null;
  },

  getFoldersSuccess: (state, { payload }) => {
    state.folders = payload;
    state.isLoading = false;
    state.error = null;
  },

  createQuestionSuccess: (state, { payload }) => {
    const folderIndex = getIndexById(state.folders, payload.folderId);
    const folder = state.folders[folderIndex];
    state.folders[folderIndex] = {...folder, questions: [...folder.questions, payload.response]};

    state.isLoading = false;
    state.error = null;
  },

  updateQuestionSuccess: (state, { payload }) => {
    const folderIndex = getIndexById(state.folders, payload.folderId);
    const folder = state.folders[folderIndex];

    const questionIndex = folder.questions.findIndex((question) => (
      question.latest_version.id === payload.response.latest_version.previous_question_version_id
    ));

    state.folders[folderIndex].questions[questionIndex] = payload.response;

    state.selectedSurvey.latest_version.latest_questions = state.selectedSurvey.latest_version.latest_questions.map(surveyQuestion => {
      if(surveyQuestion.latest_version.question_id === payload.response.latest_version.question_id) {
        const updatedQuestion = payload.response;
        updatedQuestion.latest_version.question.order = surveyQuestion.latest_version.question.order;

        return updatedQuestion;
      } else {
        return surveyQuestion;
      }
    });

    state.isLoading = false;
    state.error = null;
  },

  insertQuestionIntoSurvey: (state, { payload }) => {
    const questionInsertIndex = payload.latest_version.question.order;

    state.selectedSurvey.latest_version.latest_questions = state.selectedSurvey.latest_version.latest_questions.map(question => {
      if(question.latest_version.question.order >= questionInsertIndex) {
        question.latest_version.question.order++
      }

      return question;
    });

    state.selectedSurvey.latest_version.latest_questions = [...state.selectedSurvey.latest_version.latest_questions, payload]
  },

  swapQuestions: (state, { payload }) => {
    const questionA = state.selectedSurvey.latest_version.latest_questions.findIndex((q) => q.latest_version.question.order === payload.newOrder);
    const questionB = state.selectedSurvey.latest_version.latest_questions.findIndex((q) => q.latest_version.question.order === payload.question.latest_version.question.order);

    state.selectedSurvey.latest_version.latest_questions[questionA].latest_version.question.order = payload.question.latest_version.question.order;
    state.selectedSurvey.latest_version.latest_questions[questionB].latest_version.question.order = payload.newOrder;
  },

  removeQuestionFromSurvey: (state, { payload }) => {
    let latestQuestions = state.selectedSurvey.latest_version.latest_questions.filter(question => question.latest_version.question_id !== payload)

    latestQuestions.map((question, index) => {
      const temp = question;
      temp.latest_version.question.order = index;

      return temp;
    });

    state.selectedSurvey.latest_version.latest_questions = latestQuestions;
  },

  updateSurveySuccess: (state, { payload }) => {
    state.surveys = state.surveys.map(survey => payload.id === survey.id ? payload : survey);

    toast.success("Survey updated successfully");
    state.isLoading = false;
    state.error = null;
  },

  deleteFolderSuccess: (state, { payload }) => {
    state.folders = state.folders.filter((folder) => folder.id !== payload.payload);

    state.isLoading = false;
    state.error = null;
  },

  getSelectedQuestionVersionsSuccess: (state, { payload }) => {
    state.selectedQuestionVersions = payload;

    state.isLoading = false;
    state.error = null;
  },

  deleteQuestionVersionSuccess: (state, { payload }) => {

    state.selectedQuestionVersions = state.selectedQuestionVersions.filter(version => version.id !== payload.payload);

    state.isLoading = false;
    state.error = null;
  },

  deleteLatestQuestionVersionSuccess: (state, { payload }) => {
    state.selectedQuestionVersions = payload.newVersions;

    const latestVersion = payload.newVersions.filter(version => version.is_latest_version)[0];

    const folderIndex = getIndexById(state.folders, payload.folderId);
    const folder = state.folders[folderIndex];

    const questionIndex = folder.questions.findIndex((question) => (
      question.latest_version.question_id === latestVersion.question_id
    ));

    const newVersionOfQuestion = {...state.folders[folderIndex].questions[questionIndex], latest_version: latestVersion};

    state.folders[folderIndex].questions[questionIndex] = newVersionOfQuestion;

    state.selectedSurvey.latest_version.latest_questions = state.selectedSurvey.latest_version.latest_questions.map(surveyQuestion => {
      if(surveyQuestion.latest_version.question_id === latestVersion.question_id) {

        newVersionOfQuestion.latest_version.question.order = surveyQuestion.latest_version.question.order;

        return newVersionOfQuestion;
      } else {
        return surveyQuestion;
      }
    });

    state.isLoading = false;
    state.error = null;
  },

  deleteQuestionSuccess: (state, { payload }) => {
    const folderIndex = getIndexById(state.folders, payload.folderId);
    const folder = state.folders[folderIndex];

    state.folders[folderIndex].questions = folder.questions.filter(question => question.latest_version.question_id !== payload.questionId);

    state.selectedSurvey.latest_version.latest_questions = state.selectedSurvey.latest_version.latest_questions.filter(surveyQuestion => (
      surveyQuestion.latest_version.question_id !== payload.questionId
    ));

    state.selectedSurvey.latest_version.latest_questions = state.selectedSurvey.latest_version.latest_questions.map((question, index) => {
      const temp = question;
      temp.latest_version.question.order = index;

      return temp;
    });

    state.isLoading = false;
    state.error = null;
  },

  getSurveyVersionsSuccess: (state, { payload }) => {
    state.selectedSurveyVersions = payload;

    state.isLoading = false;
    state.error = null;
  },

  deleteSurveySuccess: (state, { payload }) => {
    state.surveys = state.surveys.filter(survey => survey.latest_version.id !== payload.payload);
    state.selectedSurveyVersions = null;

    state.isLoading = false;
    state.error = null;
  },

  deleteSurveyLatestVersionSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.error = null;
  },

  deleteSurveyVersionSuccess: (state, { payload }) => {
    let newVersion = state.selectedSurveyVersions.filter((version) => version.id < payload.payload)[0];

    if (!newVersion) {
      newVersion = [...state.selectedSurveyVersions].reverse().filter(version => version.id > payload.payload)[0];
    }

    state.selectedSurveyVersions = state.selectedSurveyVersions.filter(version => version.id !== payload.payload);

    newVersion.latest_questions = newVersion.latest_questions.map((question, index) => {
      const temp = {...question};
      temp.latest_version.question.order = index;
      return temp;
    });

    state.selectedSurvey.latest_version = newVersion;

    state.isLoading = false;
    state.error = null;
  },

  handleSurveyVersionSelect: (state, { payload }) => {
    let newVersion = JSON.parse(JSON.stringify(payload));

    newVersion.latest_questions = newVersion.latest_questions.map((question, index) => {
      const temp = {...question};
      temp.latest_version.question.order = index;
      return temp;
    });

    state.selectedSurvey.latest_version = newVersion;
  },

  getSurveyWorkFlowsAndReviewersSuccess: (state, { payload }) => {
    state.surveyWorkFlowsAndReviewers = payload;
    state.isLoading = false;
    state.error = null;
  },

  assignSurveySuccess: (state, { payload }) => {

    state.selectedManagerAssignedSurveys = [...state.selectedManagerAssignedSurveys, payload];

    state.isLoading = false;
    state.error = null;

    toast.success("Survey added successfully")
  },


  getAssignedSurveysSuccess: (state, { payload }) => {
    state.selectedManagerAssignedSurveys = payload;
    state.isLoading = false;
    state.error = null;
  },

  getAssignedSurveysForOnboardingSuccess: (state, { payload }) => {
    state.onboardingSurveys = payload;

    state.isLoading = false;
    state.error = null;
  },

  getCurrentQuestionForAssignedSurveySuccess: (state, { payload }) => {
    state.user.profile.onboarding = { ...state.user.profile.onboarding, ...payload };

    //** todo handle when backend will be updated
    if (payload?.status === "done") {
      const currentSurveyId = state.user.profile.onboarding.id;

      const surveyIndex = state.onboardingSurveys.findIndex((survey) => survey.id === currentSurveyId);

      state.onboardingSurveys[surveyIndex] = {...state.onboardingSurveys[surveyIndex], finished_at: "something"};

    }

    state.isLoading = false;
    state.error = null;
  },

  beginSurveySuccess: (state) => {
    //** TODO fix that ****
    const currentSurveyId = state.user.profile.onboarding.id;

    const surveyIndex = state.onboardingSurveys.findIndex((survey) => survey.id === currentSurveyId);

    state.onboardingSurveys[surveyIndex] = {...state.onboardingSurveys[surveyIndex], started_at: "something"};

    state.isLoading = false;
    state.error = null;
  },

  pushAnswerSuccess: (state) => {
    state.isLoading = false;
    state.error = null;
  },

  gradeSurveyQuestionAnswerSuccess: (state, {payload}) => {
    const surveyIndex = state.selectedManagerAssignedSurveys.findIndex(survey => survey.id === payload.id);

    state.selectedManagerAssignedSurveys[surveyIndex] = payload;

    state.isLoading = false;
    state.error = null;
  },

  finishGradingSuccess: (state, {payload}) => {
    const surveyIndex = state.selectedManagerAssignedSurveys.findIndex(survey => survey.id === payload.id);

    state.selectedManagerAssignedSurveys[surveyIndex] = payload;

    state.isLoading = false;
    state.error = null;
  },

  deleteAssignedSurveySuccess: (state, {payload}) => {
    state.selectedManagerAssignedSurveys = state.selectedManagerAssignedSurveys.filter(survey => survey.id !== payload);

    state.isLoading = false;
    state.error = null;
  },

  switchToPreviousQuestionSuccess: (state, {payload}) => {
    state.user.profile.onboarding = { ...state.user.profile.onboarding, ...payload };

    state.isLoading = false;
    state.error = null;
  },

  addFeedbackToQuestionSuccess: (state, {payload}) => {
    const surveyIndex = state.selectedManagerAssignedSurveys.findIndex(survey => survey.id === payload.id);

    state.selectedManagerAssignedSurveys[surveyIndex] = payload;

    toast.success("Feedback added successfully");

    state.isLoading = false;
    state.error = null;
  },

  getAllSurveyQuestionsSuccess: (state, {payload}) => {
    if(payload.id === state.user.profile.onboarding.id) {
      state.user.profile.onboarding.passedSurveyData = payload.data;
    }

    state.isLoading = false;
    state.error = null;
  },

  getSurveyByIdSuccess: (state, {payload}) => {
    const surveyIndex = state.onboardingSurveys.findIndex(survey => survey.id === payload.id);

    state.onboardingSurveys[surveyIndex] = {...state.onboardingSurveys[surveyIndex], stats: payload.stats};

    state.isLoading = false;
    state.error = false;
  },

  updateSurveyMainDataSuccess: (state, {payload}) => {
    state.surveys = state.surveys.map(survey => payload.id === survey.id ? payload : survey);

    state.isLoading = false;
    state.error = false;
  },

};

export default surveysReducer;
