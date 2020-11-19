import instance from "api";
import {
  getProfilePath,
  getUsersPath,
  getUserByIdPath,
  updateUserAvatarPath,
  getUserAvatarPath,
  deleteUserAvatarPath,
  getUsersDataPath,
  createUserOnboarding,
  deleteUserOnboarding,
  updateUserPath,
  updateUserRolesPath,
  createUserPath,
  getInvitationsPath,
  createInvitationsPath,
  deleteInvitationsPath,
  revokeInvitationsPath,
  getInvitationPath,
  sendInvitationAcceptPath,
} from "constants/user";
import {addUserGroupsPath, removeUserGroupsPath} from "../../constants/user";

const userApi = {
  async getProfile() {
    try {
      const result = await instance({
        url: getProfilePath,
        method: "GET",
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
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

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getUserById({userId}) {
    try {
      const result = await instance({
        url: getUserByIdPath(userId),
        method: "GET",
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getUserAvatar({ managerId }) {
    try {
      const result = await instance({
        url: `${getUserAvatarPath}/${managerId}/avatar`,
        method: "GET",
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async deleteUserAvatar({ avatarId }) {
    try {
      const result = await instance({
        url: deleteUserAvatarPath(avatarId),
        method: "DELETE",
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async updateUserAvatar({ managerId, formData }) {
    try {
      const result = await instance({
        url: updateUserAvatarPath(managerId),
        method: "POST",
        data: formData,
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
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
      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async createUserOnboarding(data) {
    try {
      const result = await instance({
        url: createUserOnboarding,
        method: "POST",
        data,
      });
      return result ? result.data.data : result;
    } catch (error) {}
  },
  async deleteUserOnboarding({ id }) {
    try {
      const result = await instance({
        url: `${createUserOnboarding}/${id}`,
        method: "DELETE",
      });
      return result ? result.data.data : result;
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

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async createUser(payload) {
    try {
      const result = await instance({
        url: createUserPath,
        method: "POST",
        data: payload,
      });
      return  result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
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

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async addUsersGroup({userId, group}) {
    try {
      const result = await instance({
        url: addUserGroupsPath(userId),
        method: "PUT",
        data: {
          group_id: group.group_id,
          type: group.type
        },
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async removeUsersGroup({userId, group}) {
    try {
      const result = await instance({
        url: removeUserGroupsPath(userId),
        method: "PUT",
        data: {
          group_id: group.group_id,
          type: group.type
        },
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getInvitations() {
    try {
      const result = await instance({
        url: getInvitationsPath,
        method: "GET",
      });
      return  result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async createInvitations({payload}) {
    try {
      const result = await instance({
        url: createInvitationsPath(payload),
        method: "POST",
      });
      return  result ? result?.data?.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async deleteInvitations({payload: {managerInvitedId}}) {
    try {
      const result = await instance({
        url: deleteInvitationsPath(managerInvitedId),
        method: "DELETE",
      });
      return  result ? result?.data?.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async revokeInvitations({payload: {invitationId}}) {
    try {
      const result = await instance({
        url: revokeInvitationsPath(invitationId),
        method: "PUT",
      });
      return  result ? result?.data?.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getInvitation({payload: {invitationId}}) {
    try {
      const result = await instance({
        url: getInvitationPath(invitationId),
        method: "GET",
      });
      return  result ? result?.data?.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async sendInvitationAccept({data}) {
    try {
      const result = await instance({
        url: sendInvitationAcceptPath,
        method: "POST",
        data
      });
      return  result ? result?.data?.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },

  async userAbilityAllow (data) {
    try {
      const result = await instance({
        url: "api/ability/allow",
        method: "POST",
        data,
      })

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

  async userAbilityDisallow (data) {
    try {
      const result = await instance({
        url: "api/ability/disallow",
        method: "POST",
        data,
      })

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

  async addUserOrganization ({id, orgId, type}) {

    try {
      const result = await instance({
        url: `api/user/${id}/groups/add`,
        method: "PUT",
        data: {
          group_id: orgId,
          type: type,
        }
      })

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

  async removeUserOrganization ({userId, group_id, type}) {
    try {
      const result = await instance({
        url: `api/user/${userId}/groups/remove`,
        method: "PUT",
        data: {
          group_id,
          type,
        }
      })
    } catch (err) {
      throw err;
    }
  },

  async getUserOrganizations({payload}) {

    try {
      const result = await instance({
        url: `api/organization/user/${payload}`,
        method: "GET",
      })

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};

export default userApi;
