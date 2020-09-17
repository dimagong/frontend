import { createSlice } from "@reduxjs/toolkit";
import appReducer from "app/reducers/app/appReducer";

const token = JSON.parse(localStorage.getItem("token") || "false");

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    notifications: [],
    notification: null,
    dForms: [],
    dForm: null,
  },
  reducers: {
    ...appReducer,
  },
});

export const {
    setNotifications,
    setNotification,
    notificationsSuccess,
    notificationsRequest,
    notificationsError,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
