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
  context: 'Dashboard',
  preview: null,
  surveys: [],
  folders: null,
  selectedSurvey: null,
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
    filters: [],
    searchText: '',
    dashboard: {
      data: {},
      settings: {},
    },
    activityTypes: [],
  },
  masterSchema: {
    fields: []
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

