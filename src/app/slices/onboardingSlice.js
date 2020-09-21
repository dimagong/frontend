import { createSlice } from "@reduxjs/toolkit";
import notificationsReducer from "app/reducers/onboarding/notificationsReducer";
import dFormReducers from "app/reducers/onboarding/dFormReducers";


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
    ...dFormReducers,
  },
});

export const {
    setNotifications,
    setNotification,
    setdForms,
    setdForm,
    setNotificationGroups
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
