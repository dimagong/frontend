import instance from "api";
import qs from 'qs'
import {
  getProfilePath,
  getUsersPath,
  getUserByIdPath,
  updateUserAvatarPath,
  getUserAvatarPath,
  deleteUserAvatarPath,
  getUsersDataPath,
  getAllowedUserListPath,
  createUserOnboarding,
  updateUserPath,
  updateUserRolesPath,
  createUserPath,
  getInvitationsPath,
  createInvitationsPath,
  deleteInvitationsPath,
  revokeInvitationsPath,
  getInvitationPath,
  sendInvitationAcceptPath,
  getOnboardingsByUserPath,
  getFilterPath,
  getFilterPathByID
} from "constants/user";
import {addUserGroupsPath, removeUserGroupsPath} from "../../constants/user";
import moment from "moment";

const userApi = {
  async getFilter() {
    try {
      const result = await instance({
        url: getFilterPath,
        method: "GET",
      });

      return result ? result.data.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getActivities(payload) {
    try {
      const result = await instance({
        url: '/api/user/activities',
        method: "GET",
        params: {
          user_id: payload.managerId,
          page: payload.page
        },
      });

      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getSettings() {
    try {
      const result = await instance({
        url: '/api/settings',
        method: "GET",
      });

      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getDashboardDForms() {
    try {
      const result = await instance({
        url: '/api/user/dforms-dashboard',
        method: "GET",
      });
      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async postSettings(payload) {
    try {
      const result = await instance({
        url: '/api/settings',
        method: "POST",
        params: {
          key: 'dashboard',
        },
        data: {
          value: payload
        }
      });

      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async patchSettings(payload) {
    try {
      const result = await instance({
        url: `/api/settings/${payload.id}`,
        method: "PATCH",
        data: {
          value: payload.value
        }
      });

      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getDashboardData(payload, path) {
    let params = payload?.dForm?.id
      ? {
        page: payload.page,
        'created_at[from]': payload.from,
        app_ids: payload.dForm?.id
      }
      : {
        page: payload.page,
        'created_at[from]': payload.from,
      }
    if (payload?.dForm?.name === 'Applications Snapshot') {
      if (payload?.settings?.dForm.id) {
        params.app_ids = payload.settings.dForm.id;
      } else {
        params.app_ids = [];
      }
    }
    ['filter[type]', 'filter[value]', 'user_groups', 'ability_user_ids'].forEach(item => {
      if (payload.settings && payload.settings[item]) {
        params[item] = payload.settings[item];
      }
    })
    try {
      const result = await instance({
        url: `${path}?` + qs.stringify(params),
        method: "GET",
      });
      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getDashboardActivity(payload) {
    let params = {
        page: payload.page,
        'created_at[from]': payload.from
      };
    ['filter[type]', 'filter[value]', 'user_groups', 'ability_user_ids'].forEach(item => {
      if (payload.settings[item]) {
        params[item] = payload.settings[item];
      }
    })
    try {
      const result = await instance({
        url: `/api/user/activities-dashboard?` + qs.stringify(params),
        method: "GET",
        //params: params
      });
      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async getActivityTypes() {
    try {
      const result = await instance({
        url: '/api/user/activity-types',
        method: "GET",
      });
      return result.data.data;

    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
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
  async getOnboradingsByUser({id}) {
    try {
      const result = await instance({
        url: getOnboardingsByUserPath(id),
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
  async getAllowedUserListData() {
    try {
      const result = await instance({
        url: getAllowedUserListPath,
        method: "GET",
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
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },

  async updateUserOnboardingReviewers({reviewersIds, onboardingId}) {
    try {
      const result = await instance({
        url: "api/onboarding/" + onboardingId +  "/update-reviewers",
        method: "PUT",
        data:  {reviewer_ids: reviewersIds}
      });
      return result ? result.data : result;
    } catch (error) {}
  },
  async postFilter(filter) {
    try {
      const result = await instance({
        url: getFilterPath,
        method: "POST",
        data: {filter_name: filter.filter_name,
          data: {roles: Array.from(filter.data.roles),
                 organizations: Array.from(filter.data.organizations),
                  type: filter.data.type}
                }
      });
      return result ? result.data : result;
    } catch (error) {console.log('ERROR POST FILTER')}
  },
  async patchFilter(payload) {
    try {
      const result = await instance({
        url: getFilterPathByID(payload.id),
        method: "PATCH",
        data: { filter_name: payload.filter_name,
          data: {roles: Array.from(payload.newFilter.roles),
            organizations: Array.from(payload.newFilter.organizations),
            type: payload.newFilter.type}
        }
      });
      return result ? result.data : result;
    } catch (err) {
      throw err.response.data.error.errors;
    }
  },
  async deleteFilter(id) {
    try {
      const result = await instance({
        url: getFilterPathByID(id),
        method: "DELETE",
      });
      return result ? result.data.data : result;
    } catch (error) { console.log(error)}
  },

  async updateUserOnboardingWorkflow({workflowId, onboardingId}) {
    try {
      const result = await instance({
        url: "api/onboarding/" + onboardingId +  "/update-workflow",
        method: "PUT",
        data:  {workflow_id: workflowId}
      });
      return result ? result.data : result;
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
    let dataToSend = {first_name: data.first_name, last_name: data.last_name, email: data.email, number: data.number}
    try {
      const result = await instance({
        url: `${updateUserPath}/${id}`,
        method: "PUT",
        params: dataToSend,
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
      });

      return result.data.data;
    } catch (err) {
      return err;
    }
  },

  async userAbilityDisallow (data) {
    try {
      const result = await instance({
        url: "api/ability/disallow",
        method: "POST",
        data,
      });

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
      });

      return result.data.data;
    } catch (err) {
      return err;
    }
  },

  async removeUserOrganization ({userId, group_id, type}) {
    try {
      await instance({
        url: `api/user/${userId}/groups/remove`,
        method: "PUT",
        data: {
          group_id,
          type,
        }
      })
    } catch (err) {
      return err;
    }

  },

  async getUserOrganizations({payload}) {

    try {
      const result = await instance({
        url: `api/organization/user/${payload}`,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      return err;
    }
  },

  async removeUserNotify() {
    try {
      const result = await instance({
        url: `api/user/reset-notify`,
        method: "POST",
      });

      return result.data.data;
    } catch (err) {
      return err;
    }
  },

  async getUserPermissions(userId) {
    try {
      const result = await instance({
        url: `/api/user/${userId}/main-permissions`,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      return err;
    }
  },

  };
export default userApi;
