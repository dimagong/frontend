import instance from "api";
import { notificationPath } from "constants/onboarding";

const notificationApi = {
  async getNotifications() {
    try {
      const result = await instance({
        url: notificationPath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async createNotification(data) {
    try {
      const result = await instance({
        url: notificationPath,
        method: "POST",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async updateNotification(data) {
    try {
      const result = await instance({
        url: `${notificationPath}/${data.id}`,
        method: "PUT",
        data
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async deleteNotification(data) {
    try {
      const result = await instance({
        url: `${notificationPath}/${data.id}`,
        method: "DELETE",
      });

      return result.data.data;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },

};

export default notificationApi;
