import { createSlice } from "@reduxjs/toolkit";

import authService from "services/auth";
import appReducer from "app/reducers/app/appReducer";
import { generateRequestAndErrorActions } from "utility/store";

const token = authService.getToken();

export const initUser = {
  first_name: "",
  last_name: "",
  email: "",
  number: "",
  valid_until: null,
  password: "",
  groups: [],
  roles: [],
  errors: {},
};

export const initialState = {
  isAuth: !!token,
  isLoading: false,
  isError: null,
  context: null,
  isContextSearchVisible: false,
  preview: null,
  surveys: [],
  folders: null,
  selectedSurvey: null,
  surveyWorkFlowsAndReviewers: null,
  selectedManagerAssignedSurveys: null,
  memberFirms: [],
  selectedMemberFirmId: null,
  selectedMemberFirmUsers: [],
  selectedMemberFirmPotentialUsers: [],
  selectedMemberFirmMSFields: null,
  resourceManager: {
    selectedResourceManager: null,
  },
  organizations: {
    selectedOrganizationIdAndType: { id: null, type: null },
    corporation: [],
    network: [],
    member_firm: [],
  },
  user: {
    organizations: {
      corporation: [],
      network: [],
      member_firm: [],
    },
    managers: [],
    manager: null,
    invitations: [],
    invitation: null,
    profile: null,
    user: initUser,
    groups: [],
    roles: [],
    modules: [],
    workflows: [],
    dForms: [],
    reviewers: [],
    filters: {
      data: [],
      id: null,
    },
    searchText: "",
    dashboard: {
      data: [],
      settings: {},
    },
    activityTypes: [],
  },
  masterSchema: {
    groups: {},
    hierarchies: {},
    masterSchemas: [],
    unapprovedFields: {},
    selectedMasterSchema: null,
    fields: [],
    users: {},
    related_applications: {},
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    ...generateRequestAndErrorActions(appReducer),
    resetAppSlice: (state) => {
      Object.assign(state, { ...initialState, isAuth: false });
    },
  },
});

export default appSlice;
