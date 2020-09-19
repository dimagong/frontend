import { createSlice } from "@reduxjs/toolkit";
import notificationsReducer from "app/reducers/onboarding/notificationsReducer";


export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    notification: {
      notifications: [],
      notification: null,
    },
    dForm: {
      dForms: [],
      dForm: null,
    }
  },
  reducers: {
    ...notificationsReducer,
  },
});

export const {
    setNotifications,
    setNotification,
    notificationsSuccess,
    notificationsRequest,
    notificationsError,
    setNotificationGroups
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
