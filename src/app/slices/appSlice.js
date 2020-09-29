import { createSlice } from "@reduxjs/toolkit";
import appReducer from "app/reducers/app/appReducer";
const token = localStorage.getItem("token");

export const appSlice = createSlice({
  name: "app",
  initialState: {
    isAuth: !!token,
    isLoading: false,
    isError: null,
    user: {
      managers: [],
      manager: null
    },
    group: {
      groups: []
    } 
  },
  reducers: {
    ...appReducer,
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

  setUser,
  
  logout,
} = appSlice.actions;

export default appSlice.reducer;
