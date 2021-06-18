import { requestLayout } from "api";

import {
  surveysGetUrl,
  surveysCreateUrl,
  addFolder,
  getFolders,
  createQuestion,
  getQuestionUpdateUrl,
  getSurveyUrl,
  getSurveyUpdateUrl,
  getFolderDeleteUrl,
  getQuestionVersionsFetchUrl,
  getQuestionVersionDeleteUrl,
  getSurveyVersionsFetchUrl,
  getSurveyVersionDeleteUrl,
  getSurveyWorkFlowsAndReviewersUrl,
  assignSurvey,
  getAssignedSurveysGetUrl,
} from "./constants";

const surveysApi = {
  async getSurveys() {
    return await requestLayout(surveysGetUrl, "GET")
  },

  async getSurvey({ payload }) {
    return await requestLayout(getSurveyUrl(payload), "GET")
  },

  async createSurvey({ payload }) {
    return await requestLayout(surveysCreateUrl, "POST", payload)
  },

  async createFolder({ payload }) {
    return await requestLayout(addFolder, "POST", payload)
  },

  async getFolders() {
    return await requestLayout(getFolders, "GET")
  },

  async createQuestion({ payload }) {
    return await requestLayout(createQuestion, "POST", payload)
  },

  async updateQuestion({ payload }) {
    return await requestLayout(getQuestionUpdateUrl(payload.questionId), "PUT", payload.data)
  },

  async updateSurvey({ payload }) {
    return await requestLayout(getSurveyUpdateUrl(payload.surveyId), "PUT", payload.data)
  },

  async deleteFolder({ payload }) {
    return await requestLayout(getFolderDeleteUrl(payload), "DELETE")
  },

  async getQuestionVersions({ payload }) {
    return await requestLayout(getQuestionVersionsFetchUrl(payload), "GET")
  },

  async deleteQuestionVersion({ payload }) {
    return await requestLayout(getQuestionVersionDeleteUrl(payload), "DELETE")
  },

  async getSurveyVersions({ payload }) {
    return await requestLayout(getSurveyVersionsFetchUrl(payload), "GET")
  },

  async deleteSurveyVersion({ payload }) {
    return await requestLayout(getSurveyVersionDeleteUrl(payload), "DELETE")
  },

  async getSurveyWorkFlowsAndReviewers() {
    return await requestLayout(getSurveyWorkFlowsAndReviewersUrl, "GET")
  },

  async assignNewSurvey({ payload }) {
    return await requestLayout(assignSurvey, "POST", payload)
  },

  async getAssignedSurveys({ payload }) {
    return await requestLayout(getAssignedSurveysGetUrl(payload), "GET")
  },

};

export default surveysApi;