import { getIndexById } from "utility/common";

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

  selectSurvey: (state, { payload }) => {
    state.selectedSurveyId = payload;
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
    console.log("update question success", payload);
    const folderIndex = getIndexById(state.folders, payload.folderId);
    const folder = state.folders[folderIndex];

    const questionIndex = folder.questions.findIndex((question) => (
      question.latest_version.id === payload.response.latest_version.previous_question_version_id
    ));

    state.folders[folderIndex].questions[questionIndex] = payload.response;

    state.isLoading = false;
    state.error = null;
  }
};

export default surveysReducer;
