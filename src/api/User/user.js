import instance from "api";
import { getProfilePath, getUsersPath, updateUserAvatarPath, getUserAvatarPath, deleteUserAvatarPath } from "constants/user";

const userApi = {
  async getProfile() {
    try {
      const result = await instance({
        url: getProfilePath,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getUsers() {
    try {
      const result = await instance({
        url: getUsersPath,
        method: "GET",
        params: {
          page: 1,
          email: ""

        }
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getUserAvatar({managerId}) {
    try {
      const result = await instance({
        url: `${getUserAvatarPath}/${managerId}/avatar`,
        method: "GET"
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async deleteUserAvatar({avatarId}) {
    try {
      const result = await instance({
        url: `${deleteUserAvatarPath}/${avatarId}`,
        method: "DELETE",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async updateUserAvatar({avatarId, formData}) {
    try {
      const result = await instance({
        url: `${updateUserAvatarPath}/${avatarId}`,
        method: "POST",
        data: formData
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};

export default userApi;
