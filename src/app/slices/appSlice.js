import { createSlice } from "@reduxjs/toolkit";
import appReducer from "app/reducers/app/appReducer";
import { generateRequestAndErrorActions } from 'utility/store'

const token = localStorage.getItem("token");

export const initUser = {
  first_name: '',
  last_name: '',
  email: '',
  number: '',
  valid_until: null,
  password: '',
  groups: [],
  roles: [],
  errors: {}
};

export const initialState = {
  isAuth: !!token,
  isLoading: false,
  isError: null,
  isContextSearchVisible: false,
  context: null,
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
  organizations: {
    selectedOrganizationIdAndType: {id: null, type: null},
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
      id: null
    },
    searchText: '',
    dashboard: {
      data: [],
      settings: {},
    },
    activityTypes: [],
  },
  masterSchema: {
    fields: [],
    list: [],
    users: {},
    unapproved: {},
    hierarchies: [],
    related_applications: {},
    selectedId: null,
  }
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    ...(generateRequestAndErrorActions(appReducer)),
    resetAppSlice: (state) => {
      Object.assign(state, {...initialState, isAuth:false})
    }
  },
});

export default appSlice;

