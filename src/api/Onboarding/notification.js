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
      throw err;
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
      throw err;
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
      throw err;
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
      throw err;
    }
  },

};

export default notificationApi;
