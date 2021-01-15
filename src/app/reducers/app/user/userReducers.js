import {initUser} from 'app/slices/appSlice';
import {toast} from 'react-toastify'

const getProfileSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.profile = {
    ...payload,
    onboarding: []
  };
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
  // Currently organizations fetch with another request, and user update doesn't affect user orgs
  // so to prevent user org lost and no to re-fetch it we are saving them here
  state.user.managers = state.user.managers.map( manager => {
    if (manager.id === state.user.manager.id) {
      payload.organizations = manager.organizations
      return payload;
    } else {
      return manager
    }
  } );
  toast.success("Saved")
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

  state.user.managers = state.user.managers.map((manager) => {
    if (manager.id === payload.managerId) {
      manager.avatar = payload.avatar;
    }

    return manager;
  })

  // state.user.manager = {...state.user.manager,...payload};
};
const updateUserAvatarRequest = (state, { payload }) => {
  state.isLoading = true;
  state.isError = null;
};
const updateUserAvatarError = (state, { payload }) => {
  state.isLoading = false;
  state.isError = payload;
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
  // state.user.manager = {...state.user.manager, url : null, avatar: null};
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

  state.user.managers = state.user.managers.map((manager) => {
    if (manager.id === payload.managerId) {
      manager.url = payload.url.avatar;
    }

    return manager;
  })
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
  state.user.managers = [payload, ...state.user.managers];
  toast.success("User successfully created")
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

const getUserOrganizationsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}

const getUserOrganizationsSuccess = (state, {payload}) => {
  state.isLoading =  false;

  const userIndex = state.user.managers.findIndex((manager) => manager.id === payload.userId)
  const user = state.user.managers[userIndex]

  user.organizations = {
    corporation: payload.response.filter((org) =>  org.type === "corporation"),
    member_firm: payload.response.filter((org) =>  org.type === "member_firm"),
    network: payload.response.filter((org) =>  org.type === "network"),
  }

  state.user.managers[userIndex] = user;
}

const getUserOrganizationsError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}

const addUserOrganizationRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}
const addUserOrganizationSuccess = (state, {payload}) => {

  state.isLoading = false;
  const userIndex = state.user.managers.findIndex((manager) => manager.id === payload.userId)
  const user = state.user.managers[userIndex]

  user.organizations[payload.response.type] = [...user.organizations[payload.response.type], payload.response]

  state.user.managers[userIndex] = user;

}
const addUserOrganizationError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}

const removeUserOrganizationRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}
const removeUserOrganizationSuccess = (state, {payload}) => {
  state.isLoading = false;

  const userIndex = state.user.managers.findIndex((manager) => manager.id === payload.userId)
  const user = state.user.managers[userIndex]

  user.organizations[payload.response.type] = user.organizations[payload.response.type].filter((org) => org.id !== payload.response.group_id)

  state.user.managers[userIndex] = user;
}
const removeUserOrganizationError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}

const allowUserAbilityRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}
const allowUserAbilitySuccess = (state, {payload}) => {

  const userIndex = state.user.managers.findIndex((manager) => manager.id === payload.data.user_id)
  const user = state.user.managers[userIndex]

  user.organizations[payload.data.organization_type].filter(({id}) => id === payload.data.organization_id)[0].abilities = payload.response

  state.user.managers[userIndex] = user;
  state.isLoading = false;
}
const allowUserAbilityError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}


const disallowUserAbilityRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}
const disallowUserAbilitySuccess = (state, {payload}) => {
  const userIndex = state.user.managers.findIndex((manager) => manager.id === payload.data.user_id)
  const user = state.user.managers[userIndex]
  user.organizations[payload.data.organization_type].filter(({id}) => id === payload.data.organization_id)[0].abilities = payload.response
  state.user.managers[userIndex] = user;
  state.isLoading = false;
}
const disallowUserAbilityError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}


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

  getUserOrganizationsRequest,
  getUserOrganizationsSuccess,
  getUserOrganizationsError,

  addUserOrganizationRequest,
  addUserOrganizationSuccess,
  addUserOrganizationError,

  removeUserOrganizationRequest,
  removeUserOrganizationSuccess,
  removeUserOrganizationError,

  allowUserAbilityRequest,
  allowUserAbilitySuccess,
  allowUserAbilityError,

  disallowUserAbilityRequest,
  disallowUserAbilitySuccess,
  disallowUserAbilityError,

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
