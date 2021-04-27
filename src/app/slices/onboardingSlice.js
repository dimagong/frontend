import { createSlice } from "@reduxjs/toolkit";
import notificationsReducer from "app/reducers/onboarding/notificationsReducer";
import dFormReducers from "app/reducers/onboarding/dFormReducers";
import surveyReducers from "app/reducers/onboarding/surveyReducers";
import workflowReducers from "app/reducers/onboarding/workflowReducers";

import { generateRequestAndErrorActions } from "utility/store";

const onboardingReducer = {
  ...notificationsReducer,
  ...dFormReducers,
  ...surveyReducers,
  ...workflowReducers,
};

export const onboardingInitialState = {
  notification: {
    notifications: [],
    notification: null,
  },
  survey: {
    triggers: [],
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
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: onboardingInitialState,
  reducers: {
    ...(generateRequestAndErrorActions(onboardingReducer)),
    resetOnboardingSlice: (state) => {
      Object.assign(state, onboardingInitialState)
    }
  },
});

export default onboardingSlice;
