import { createSlice } from "@reduxjs/toolkit";
import appReducer from "app/reducers/app/appReducer";
import moment from 'moment';
const token = localStorage.getItem("token");

export const initUser = {
  first_name: '',
  last_name: 'surname',
  email: '',
  number: '',
  valid_until: null,
  password: '',
  groups: [],
  roles: [],
  errors: {}
};

export const initialState = {
  isAuth: !!token,
  isLoading: false,
  isError: null,
  isContextSearchVisible: true,
  context: null,
  preview: null,
  organizations: {
    corporation: [],
    network: [],
    member_firm: [],
  },
  user: {
    organizations: {
      corporation: [],
      network: [],
      member_firm: [],
    },
    managers: [],
    manager: null,
    invitations: [],
    invitation: null,
    profile: null,
    user: initUser,
    groups: [],
    roles: [],
    modules: [],
    workflows: [],
    dForms: [],
    reviewers: [],
  },
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    ...appReducer,
    resetAppSlice: (state) => {
      Object.assign(state, {...initialState, isAuth:false})
    }
  },
});

export const {
  loginSuccess,
  loginRequest,
  loginError,

  resetPasswordSuccess,
  resetPasswordRequest,
  resetPasswordError,

  verifyPasswordSuccess,
  verifyPasswordRequest,
  verifyPasswordError,

  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsError,

  getProfileSuccess,
  getProfileRequest,
  getProfileError,

  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,

  getRolesSuccess,
  getRolesRequest,
  getRolesError,

  getModulesSuccess,
  getModulesRequest,
  getModulesError,

  createNotificationSuccess,
  createNotificationRequest,
  createNotificationError,

  updateNotificationSuccess,
  updateNotificationRequest,
  updateNotificationError,

  deleteNotificationSuccess,
  deleteNotificationRequest,
  deleteNotificationError,

  getdFormsSuccess,
  getdFormsRequest,
  getdFormsError,

  createdFormSuccess,
  createdFormRequest,
  createdFormError,

  updatedFormSuccess,
  updatedFormRequest,
  updatedFormError,

  deletedFormSuccess,
  deletedFormRequest,
  deletedFormError,

  submitdFormSuccess,
  submitdFormRequest,
  submitdFormError,

  submitdFormDataSuccess,
  submitdFormDataRequest,
  submitdFormDataError,

  changedFormStatusSuccess,
  changedFormStatusRequest,
  changedFormStatusError,

  getWorkflowsSuccess,
  getWorkflowsRequest,
  getWorkflowsError,

  createWorkflowSuccess,
  createWorkflowRequest,
  createWorkflowError,

  updateWorkflowSuccess,
  updateWorkflowRequest,
  updateWorkflowError,

  deleteWorkflowSuccess,
  deleteWorkflowRequest,
  deleteWorkflowError,

  getdFormActionsSuccess,
  getdFormActionsRequest,
  getdFormActionsError,

  getdFormTriggersSuccess,
  getdFormTriggersRequest,
  getdFormTriggersError,

  getUsersSuccess,
  getUsersRequest,
  getUsersError,

  getUserByIdSuccess,
  getUserByIdRequest,
  getUserByIdError,

  updateUserSuccess,
  updateUserRequest,
  updateUserError,

  updateUserAvatarSuccess,
  updateUserAvatarRequest,
  updateUserAvatarError,

  deleteUserAvatarSuccess,
  deleteUserAvatarRequest,
  deleteUserAvatarError,

  getUserAvatarSuccess,
  getUserAvatarRequest,
  getUserAvatarError,

  getUserOnboardingSuccess,
  getUserOnboardingRequest,
  getUserOnboardingError,

  createUserOnboardingSuccess,
  createUserOnboardingRequest,
  createUserOnboardingError,

  deleteUserOnboardingSuccess,
  deleteUserOnboardingRequest,
  deleteUserOnboardingError,

  updateUserRolesSuccess,
  updateUserRolesRequest,
  updateUserRolesError,

  addUserGroupsSuccess,
  addUserGroupsRequest,
  addUserGroupsError,

  removeUserGroupsSuccess,
  removeUserGroupsRequest,
  removeUserGroupsError,

  updateUserModulesSuccess,
  updateUserModulesRequest,
  updateUserModulesError,

  createUserSuccess,
  createUserRequest,
  createUserError,

  getInvitationsSuccess,
  getInvitationsRequest,
  getInvitationsError,

  createInvitationsSuccess,
  createInvitationsRequest,
  createInvitationsError,

  deleteInvitationsSuccess,
  deleteInvitationsRequest,
  deleteInvitationsError,

  revokeInvitationsSuccess,
  revokeInvitationsRequest,
  revokeInvitationsError,

  getInvitationSuccess,
  getInvitationRequest,
  getInvitationError,

  sendInvitationAcceptSuccess,
  sendInvitationAcceptRequest,
  sendInvitationAcceptError,

  setManager,
  setUser,
  setUserGroups,
  setUserModules,
  setUserRoles,
  setManagerOnboardingProperty,
  setManagerOnboarding,
  setUserDForms,
  setUserWorkflows,
  setUserReviewers,
  getUserManagment,
  setProfileOnboarding,

  showContextSearch,
  hideContextSearch,
  setContext,
  setPreview,

  getOrganizationsRequest,
  getOrganizationsSuccess,
  getOrganizationsError,

  getUserOrganizationsRequest,
  getUserOrganizationsSuccess,
  getUserOrganizationsError,

  addUserOrganizationRequest,
  addUserOrganizationSuccess,
  addUserOrganizationError,

  resetAppSlice,
  logout,
} = appSlice.actions;

export default appSlice.reducer;
