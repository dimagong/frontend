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
  notificationsSuccess,
  notificationsRequest,
  notificationsError,
} = appSlice.actions;

export default appSlice.reducer;
