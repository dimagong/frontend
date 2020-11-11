import {initUser} from 'app/slices/appSlice';

const getProfileSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.profile = payload;
};

const getProfileRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};

const getProfileError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const getUsersSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.managers = payload;
};

const getUsersRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const getUsersError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const getUserByIdSuccess = (state, { payload }) => {

  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...payload, onboarding: payload.onboardings.find( onboarding => onboarding.id === state.user.manager.onboarding.id)}
};

const getUserByIdRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const getUserByIdError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateUserSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.managers = state.user.managers.map( manager => manager.id === state.user.manager.id ? payload : manager );
};

const updateUserRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};

const updateUserError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateUserAvatarSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};
const updateUserAvatarRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const updateUserAvatarError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const deleteUserAvatarSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager, url : null, avatar: null};
};
const deleteUserAvatarRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const deleteUserAvatarError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const getUserAvatarSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,url: payload.url.avatar};
};
const getUserAvatarRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const getUserAvatarError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const getUserOnboardingSuccess = (state, { payload: {dForms, workflows, reviewers} }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.workflows = workflows;
  state.user.dForms = dForms;
  state.user.reviewers = reviewers;
};
const getUserOnboardingRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const getUserOnboardingError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const createUserOnboardingSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager.onboardings = [...state.user.manager.onboardings, payload];
  state.user.manager.onboarding = null;
  state.user.managers = state.user.managers.map( manager => manager.id === state.user.manager.id ? {...manager, onboardings: [...manager.onboardings, payload]} : manager);
};
const createUserOnboardingRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const createUserOnboardingError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const deleteUserOnboardingSuccess = (state, { payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager.onboardings = state.user.manager.onboardings.filter(oboarding => oboarding.id !== payload.id);
  state.user.manager.onboarding = null;
  state.user.managers = state.user.managers.map( manager => manager.id === state.user.manager.id ? {...manager, onboardings: manager.onboardings.filter(oboarding => oboarding.id !== payload.id)} : manager)
};
const deleteUserOnboardingRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const deleteUserOnboardingError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateUserRolesSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};
const updateUserRolesRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const updateUserRolesError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const addUserGroupsSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};

const addUserGroupsRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const addUserGroupsError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};


const removeUserGroupsSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};

const removeUserGroupsRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const removeUserGroupsError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateUserModulesSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};
const updateUserModulesRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const updateUserModulesError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

const createUserSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.user = initUser;
  state.user.managers = [payload, ...this.state.user.managers];
};

const createUserRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};

const createUserError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
};

// TODO: SETTERS

const setUser = (state, { payload }) => {

  state.isLoading = false;
  state.isError = null;
  state.user.user = payload;
};

const setManager = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = payload;
};
const setUserGroups = (state, {payload}) => {
  state.user.groups = payload;
};
const setUserModules = (state, {payload}) => {
  state.user.modules = payload;
}
const setUserRoles = (state, {payload}) => {
  state.user.roles = payload;
}

const setManagerOnboarding = (state, {payload}) => {
  state.user.manager.onboarding = payload;
}

const setProfileOnboarding = (state, {payload}) => {
  state.user.profile.onboarding = payload;
}

const setManagerOnboardingProperty = (state, {payload}) => {
  state.user.manager.onboarding = {...state.user.manager.onboarding, ...payload};
}
const setUserDForms = (state, {payload}) => {
  state.user.manager.onboarding.d_form = payload;
}

const setUserWorkflows = (state, {payload}) => {
  state.user.manager.onboarding.workflow = payload;
}

const setUserReviewers = (state, {payload}) => {
  state.user.manager.onboarding.reviewers = payload;
}

const getUserManagment = (state) => {}


export default {
  getProfileSuccess,
  getProfileRequest,
  getProfileError,
  getUsersSuccess,
  getUsersRequest,
  getUsersError,
  getUserByIdSuccess,
  getUserByIdRequest,
  getUserByIdError,
  updateUserSuccess,
  updateUserRequest,
  updateUserError,
  createUserSuccess,
  createUserRequest,
  createUserError,
  updateUserAvatarSuccess,
  updateUserAvatarRequest,
  updateUserAvatarError,
  deleteUserAvatarSuccess,
  deleteUserAvatarRequest,
  deleteUserAvatarError,
  getUserAvatarSuccess,
  getUserAvatarRequest,
  getUserAvatarError,
  getUserOnboardingSuccess,
  getUserOnboardingRequest,
  getUserOnboardingError,
  createUserOnboardingSuccess,
  createUserOnboardingRequest,
  createUserOnboardingError,
  deleteUserOnboardingSuccess,
  deleteUserOnboardingRequest,
  deleteUserOnboardingError,
  updateUserRolesSuccess,
  updateUserRolesRequest,
  updateUserRolesError,

  addUserGroupsSuccess,
  addUserGroupsRequest,
  addUserGroupsError,

  removeUserGroupsSuccess,
  removeUserGroupsRequest,
  removeUserGroupsError,

  updateUserModulesSuccess,
  updateUserModulesRequest,
  updateUserModulesError,
  setUser,
  setManager,
  setUserGroups,
  setUserModules,
  setUserRoles,
  setManagerOnboardingProperty,
  setManagerOnboarding,
  setUserDForms,
  setUserWorkflows,
  setUserReviewers,
  getUserManagment,
  setProfileOnboarding,
};
