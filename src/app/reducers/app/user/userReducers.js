import {initUser} from 'app/slices/appSlice';
import {toast} from 'react-toastify';
import {
  getUserAndUserIndex,
  getIndexById,
} from "utility/common";


const getProfileSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.profile = {
    ...payload,
    onboarding: []
  };
};

const getUsersSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.managers = payload;
};

const getFilterSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  let filters = payload;
  filters.forEach(item => {
    item.data.roles = new Set(item.data.roles);
    item.data.organizations = new Set(item.data.organizations);
  });
  filters = filters.filter(item => item.user_id === state.user.profile.id);
  state.user.filters = filters;
};

const postFilterSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  const newFilter = payload.response.data;
  newFilter.data.roles = new Set(newFilter.data.roles)
  newFilter.data.organizations = new Set(newFilter.data.organizations)
  let filters = state.user.filters;
  filters.push(newFilter);
  state.user.filters = filters;
  toast.success(`The filter set '${payload.response.data.filter_name}' was added`);
};

const patchFilterSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  let index = state.user.filters.findIndex(item => item.id === payload.payload.id);
  state.user.filters[index].data = payload.payload.newFilter;
};

const getOnboardingsByUserSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  if(state.user?.managers) {
    state.user.managers = state.user.managers.map((nextUser) => {
      if(nextUser.id === payload.user.id) {
        nextUser.onboardings = payload.onboardings;
      }
      return nextUser;
    });
  }
};

const getUserByIdSuccess = (state, { payload }) => {

  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...payload, onboarding: payload.onboardings.find( onboarding => onboarding.id === state.user.manager.onboarding.id)}
};

const updateUserSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  // Currently organizations fetch with another request, and user update doesn't affect user orgs
  // so to prevent user org lost and no to re-fetch it we are saving them here
  state.user.managers = state.user.managers.map( manager => {
    if (manager.id === state.user.manager.id) {
      payload.organizations = manager.organizations;
      return payload;
    } else {
      return manager
    }
  } );
  toast.success("Saved")
};

const updateUserAvatarSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;

  state.user.managers = state.user.managers.map((manager) => {
    if (manager.id === payload.managerId) {
      manager.avatar = payload.avatar;
    }

    return manager;
  })
};

const deleteUserAvatarSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;

  state.user.managers = state.user.managers.map((manager) => {
    if (manager.id === payload.managerId) {
      manager.avatar = null;
      manager.url = null;
    }
    return manager;
  })
};

const deleteFilterSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  let filters = state.user.filters;
  filters = filters.filter(item => item.id !== payload);
  state.user.filters = filters;
}

const getUserAvatarSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;

  state.user.managers = state.user.managers.map((manager) => {
    if (manager.id === payload.managerId) {
      manager.url = payload.url.avatar;
    }

    return manager;
  })
};

// may be getUserOnboardings
const getUserOnboardingSuccess = (state, { payload: {dForms, workflows, reviewers} }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.workflows = workflows;
  state.user.dForms = dForms;
  state.user.reviewers = reviewers;
};

const createUserOnboardingSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager.onboardings = [...state.user.manager.onboardings, payload];
  state.user.manager.onboarding = null;

  const currentManager = state.user.managers.findIndex((manager) => manager.id === state.user.manager.id);

  state.user.managers[currentManager].onboardings = [...state.user.managers[currentManager].onboardings, payload]
};

const deleteUserOnboardingSuccess = (state, { payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager.onboardings = state.user.manager.onboardings.filter(oboarding => oboarding.id !== payload.id);
  state.user.manager.onboarding = null;

  const currentManager = state.user.managers.findIndex((manager) => manager.id === state.user.manager.id);

  state.user.managers[currentManager].onboardings = state.user.managers[currentManager].onboardings.filter((onboarding) => onboarding.id !== payload.id)
};

const updateUserRolesSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};

const addUserGroupsSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};

const removeUserGroupsSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};

const updateUserModulesSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.manager = {...state.user.manager,...payload};
};

const createUserSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.user = initUser;
  state.user.managers = [payload, ...state.user.managers];
  toast.success("User successfully created")
};

const updateUserOnboardingReviewersSuccess = (state, { payload }) => {
  state.isLoading = false;

  const managerIndex = state.user.managers.findIndex(manager => manager.id === payload.managerId);
  const onboardingIndex = state.user.managers[managerIndex].onboardings.findIndex(onboarding => onboarding.id === payload.onboardingId);

  state.user.managers[managerIndex].onboardings[onboardingIndex] = payload.response

};


const updateUserOnboardingWorkflowSuccess = (state, { payload }) => {
  state.isLoading = false;

  const managerIndex = state.user.managers.findIndex(manager => manager.id === payload.managerId);
  const onboardingIndex = state.user.managers[managerIndex].onboardings.findIndex(onboarding => onboarding.id === payload.onboardingId);

  state.user.managers[managerIndex].onboardings[onboardingIndex] = payload.response
};

// SETTERS

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

const setSearch = (state, { payload }) => {
  state.user.searchText = payload;
};

const setUserGroups = (state, {payload}) => {
  state.user.groups = payload;
};
const setUserModules = (state, {payload}) => {
  state.user.modules = payload;
};
const setUserRoles = (state, {payload}) => {
  state.user.roles = payload;
};

const setManagerOnboarding = (state, {payload}) => {
  state.user.manager.onboarding = payload;
};

const setProfileOnboarding = (state, {payload}) => {
  state.user.profile.onboarding = payload;
};

const setManagerOnboardingProperty = (state, {payload}) => {
  state.user.manager.onboarding = {...state.user.manager.onboarding, ...payload};
};
const setUserDForms = (state, {payload}) => {
  state.user.manager.onboarding.d_form = payload;
};

const setUserWorkflows = (state, {payload}) => {
  state.user.manager.onboarding.workflow = payload;
};

const setUserReviewers = (state, {payload}) => {
  state.user.manager.onboarding.reviewers = payload;
};

const getUserManagment = () => {};

const getUserOrganizationsSuccess = (state, {payload}) => {
  state.isLoading =  false;

  const userIndex = state.user.managers.findIndex((manager) => manager.id === payload.userId);
  const user = state.user.managers[userIndex];

  user.organizations = {
    corporation: payload.response.filter((org) =>  org.type === "corporation"),
    member_firm: payload.response.filter((org) =>  org.type === "member_firm"),
    network: payload.response.filter((org) =>  org.type === "network"),
  };

  state.user.managers[userIndex] = user;
};

const addUserOrganizationSuccess = (state, {payload}) => {
  state.isLoading = false;

  const {userIndex, user} = getUserAndUserIndex(state.user.managers, payload.userId);

  user.organizations[payload.response.type] = [...user.organizations[payload.response.type], payload.response];

  state.user.managers[userIndex] = user;
};

const removeUserOrganizationSuccess = (state, {payload}) => {
  state.isLoading = false;
  const {userIndex, user} = getUserAndUserIndex(state.user.managers, payload.userId);

  user.organizations[payload.response.type] = user.organizations[payload.response.type].filter((org) => org.id !== payload.response.group_id);

  state.user.managers[userIndex] = user;
};

const allowUserAbilitySuccess = (state, {payload}) => {
  const {userIndex, user} = getUserAndUserIndex(state.user.managers, payload.data.user_id);

  const editedOrg = user.organizations[payload.data.organization_type].filter(({id}) => id === payload.data.organization_id)[0];
  editedOrg.abilities = payload.response;

  state.user.managers[userIndex] = user;
  state.isLoading = false;
};

const disallowUserAbilitySuccess = (state, {payload}) => {
  const {userIndex, user} = getUserAndUserIndex(state.user.managers, payload.data.user_id);

  user.organizations[payload.data.organization_type].filter(({id}) => id === payload.data.organization_id)[0].abilities = payload.response;
  state.user.managers[userIndex] = user;
  state.isLoading = false;
};

const removeUserNotifySuccess = (state) => {
  state.isLoading = false;
  state.user.profile.notify = 0;
};

const getUserOrganizationLogoSuccess = (state, {payload}) => {
  state.user.profile.permissions.logo.isLoading = false;
  state.user.profile.permissions.logo.base64 = payload;
};

const getUserPermissionsSuccess = (state, {payload}) => {
  state.isLoading = false;
  const userIndex = getIndexById(state.user.managers, payload.payload);
  state.user.managers[userIndex].permissions = payload.result;
};

export default {
  getProfileSuccess,
  getUsersSuccess,
  getUserByIdSuccess,
  updateUserSuccess,
  createUserSuccess,
  updateUserAvatarSuccess,
  deleteUserAvatarSuccess,
  getUserAvatarSuccess,
  getUserOnboardingSuccess,
  createUserOnboardingSuccess,
  deleteUserOnboardingSuccess,
  updateUserRolesSuccess,
  addUserGroupsSuccess,
  removeUserGroupsSuccess,
  getUserOrganizationsSuccess,
  addUserOrganizationSuccess,
  removeUserOrganizationSuccess,
  allowUserAbilitySuccess,
  disallowUserAbilitySuccess,
  removeUserNotifySuccess,
  getUserOrganizationLogoSuccess,
  updateUserModulesSuccess,
  updateUserOnboardingReviewersSuccess,
  updateUserOnboardingWorkflowSuccess,
  getOnboardingsByUserSuccess,
  getFilterSuccess,
  postFilterSuccess,
  deleteFilterSuccess,
  patchFilterSuccess,
  getUserPermissionsSuccess,
  setSearch,

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
