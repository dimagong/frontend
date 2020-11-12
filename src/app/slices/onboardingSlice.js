import { createSlice } from "@reduxjs/toolkit";
import notificationsReducer from "app/reducers/onboarding/notificationsReducer";
import dFormReducers from "app/reducers/onboarding/dFormReducers";
import workflowReducers from "app/reducers/onboarding/workflowReducers";


export const onboardingInitialState = {
  notification: {
    notifications: [],
    notification: null,
  },
  dForm: {
    dForms: [],
    dForm: null,
    actions: [],
    triggers: [],
  },
  workflow: {
    workflows: [],
    workflow: null,
  },
}

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: onboardingInitialState,
  reducers: {
    ...notificationsReducer,
    ...dFormReducers,
    ...workflowReducers,
    resetOnboardingSlice: (state) => {
      Object.assign(state, onboardingInitialState)
    }
  },
});

export const {
  setNotifications,
  setNotification,
  setNotificationGroups,
  setdForms,
  setdForm,
  setdFormGroups,
  setdFormActions,
  setdFormTriggers,
  setWorkflows,
  setWorkflow,
  setWorkflowGroups,
  setWorkflowTriggers,
  resetOnboardingSlice,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
