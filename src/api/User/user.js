import instance from "api";
import {
  getProfilePath,
  getUsersPath,
  updateUserAvatarPath,
  getUserAvatarPath,
  deleteUserAvatarPath,
  getUsersDataPath,
  createUserOnboarding,
  deleteUserOnboarding,
  updateUserPath,
  updateUserRolesPath,
  updateUserGroupsPath,
} from "constants/user";

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
          email: "",
        },
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getUserAvatar({ managerId }) {
    try {
      const result = await instance({
        url: `${getUserAvatarPath}/${managerId}/avatar`,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async deleteUserAvatar({ avatarId }) {
    try {
      const result = await instance({
        url: deleteUserAvatarPath(avatarId),
        method: "DELETE",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async updateUserAvatar({ managerId, formData }) {
    try {
      const result = await instance({
        url: updateUserAvatarPath(managerId),
        method: "POST",
        data: formData,
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async getUsersData() {
    try {
      const result = await instance({
        url: getUsersDataPath,
        method: "GET",
        params: {
          page: 1,
        },
      });
      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async createUserOnboarding(data) {
    try {
      const result = await instance({
        url: createUserOnboarding,
        method: "POST",
        data,
      });
      return result.data.data;
    } catch (error) {}
  },
  async deleteUserOnboarding({ id }) {
    try {
      const result = await instance({
        url: `${createUserOnboarding}/${id}`,
        method: "DELETE",
      });
      return result.data.data;
    } catch (error) {}
  },
  async updateUser(payload) {
    const { id, ...data } = payload;
    try {
      const result = await instance({
        url: `${updateUserPath}/${id}`,
        method: "PUT",
        data,
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async updateUserRoles(payload) {
    const { id, roles } = payload;
    try {
      const result = await instance({
        url: updateUserRolesPath(id),
        method: "PUT",
        data: {roles},
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
  async updateGroupRoles(payload) {
    const { id, groups } = payload;
    try {
      const result = await instance({
        url: updateUserGroupsPath(id),
        method: "PUT",
        data: {groups: groups.map( (group, id) => ({type: group.type, group_id:  group.id}))},
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};

export default userApi;
