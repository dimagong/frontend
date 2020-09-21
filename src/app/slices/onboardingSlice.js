import { createSlice } from "@reduxjs/toolkit";
import notificationsReducer from "app/reducers/onboarding/notificationsReducer";
import dFormReducers from "app/reducers/onboarding/dFormReducers";
import workflowReducers from "app/reducers/onboarding/workflowReducers";


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
    },
    workflow: {
      workflows: [],
      workflow: null,
    },
  },
  reducers: {
    ...notificationsReducer,
    ...dFormReducers,
    ...workflowReducers,
  },
});

export const {
    setNotifications,
    setNotification,
    setNotificationGroups,
    setdForms,
    setdForm,
    setdFormGroups,
    setWorkflows,
    setWorkflow,
    setWorkflowGroups
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
