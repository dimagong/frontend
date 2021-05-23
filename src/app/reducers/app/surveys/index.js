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
        return payload.response;
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
    state.selectedSurvey.latest_version.latest_questions = state.selectedSurvey.latest_version.latest_questions.filter(question => question.latest_version.question_id !== payload)
  },

  changeSurveyTitleAndDescription: (state, { payload }) => {
    state.selectedSurvey.latest_version.title = payload.title;
    state.selectedSurvey.latest_version.description = payload.description;
  },

  updateSurveySuccess: (state, { payload }) => {
    state.surveys = state.surveys.map(survey => payload.id === survey.id ? payload : survey);

    toast.success("Survey updated successfully");
    state.isLoading = false;
    state.error = null;
  },
};

export default surveysReducer;
