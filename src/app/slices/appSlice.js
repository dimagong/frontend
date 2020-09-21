import { createSlice } from "@reduxjs/toolkit";
import appReducer from "app/reducers/app/appReducer";
const token = localStorage.getItem("token");

export const appSlice = createSlice({
  name: "app",
  initialState: {
    isAuth: !!token,
    isLoading: false,
    isError: null,
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
  logout,
} = appSlice.actions;

export default appSlice.reducer;
