import { requestLayout } from "api";

import {
  surveysGetUrl,
  surveysCreateUrl,
  addFolder,
  getFolders,
  createQuestion,
  getQuestionUpdateUrl,
} from "./constants";

const surveysApi = {
  async getSurveys() {
    return await requestLayout(surveysGetUrl, "GET")
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

};

export default surveysApi;
