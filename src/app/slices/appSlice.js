import { createSlice } from "@reduxjs/toolkit";
import appReducer from "app/reducers/app/appReducer";

const token = JSON.parse(localStorage.getItem("token") || "false");

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
} = appSlice.actions;

export default appSlice.reducer;
