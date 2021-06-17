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
    item.value.roles = new Set(item.value.roles);
    item.value.organizations = new Set(item.value.organizations);
  });
  filters = filters.filter(item => item.user_id === state.user.profile.id);
  state.user.filters = filters;
};

const getSettingsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  let dashboardSettings = payload.find(item => item.key === 'dashboard');
  if (dashboardSettings) {
    state.user.dashboard.settings = {
      value: dashboardSettings.value,
      id: dashboardSettings.id
    };
  } else {
    state.user.dashboard.settings = {
      value: [{
        daysNumber: 7,
        state: 'large',
        filter: null,
        title: 'Activities',
        key: 0,
      },{
        daysNumber: 7,
        state: 'large',
        filter: null,
        title: 'Applications',
        dForm: null,
        key: 1,
      }]
    }
  }
}

const postSettingsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.dashboard.settings = {id: payload.response.id, value: payload.payload};
}

const patchSettingsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.dashboard.settings = payload;
}

const getActivitiesSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  let managerIndex = state.user.managers.findIndex(item => item.id === payload.user_id);

  if (state.user.managers[managerIndex].activity && state.user.managers[managerIndex].activity.current_page < payload.response.current_page) {
    let newData = state.user.managers[managerIndex].activity.data = state.user.managers[managerIndex].activity.data.concat(payload.response.data);
    state.user.managers[managerIndex].activity = payload.response;
    state.user.managers[managerIndex].activity.data = newData;
  } else if (!state.user.managers[managerIndex].activity || payload.shouldUpdate) {
    state.user.managers[managerIndex].activity = payload.response;
  }
};

const updateActivitiesSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  let managerIndex = state.user.managers.findIndex(item => item.id === payload.user_id);

  if (!state.user.managers[managerIndex].activity) {
    state.user.managers[managerIndex].activity = payload.response;
  } else {
    let startingIndex = payload.response.data.findIndex(item => item.id ===  state.user.managers[managerIndex].activity.data[0].id)
    for (let i = startingIndex - 1; i > -1; --i) {
      state.user.managers[managerIndex].activity.data.splice(0, 0, payload.response.data[i]);
    }
  }
};

const getDashboardDataSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  let currDataIndex = state?.user?.dashboard?.data?.length > 0
    ? state?.user?.dashboard?.data.findIndex(item => item.key === payload.payload.key)
    : -1;
  let currData = currDataIndex === -1 ? {} : {...state?.user?.dashboard?.data[currDataIndex]}

  if (payload.payload.page === 1) {
    currData.userDFormActivities = payload.response.userDFormActivities;
    currData.userDFormActivitiesSchedule = payload.response.userDFormActivitiesSchedule;
    currData.key = payload.payload.key;
    if (currDataIndex === -1) {
      state.user.dashboard.data.push(currData);
    } else {
      state.user.dashboard.data[currDataIndex] = currData;
    }
    return;
  }

  if (currData?.userDFormActivities && payload.response.userDFormActivities.current_page > currData.userDFormActivities.current_page) {
    let newData = currData.userDFormActivities.data.concat(payload.response.userDFormActivities.data)
    currData.userDFormActivities = payload.response.userDFormActivities;
    currData.userDFormActivities.data = newData;
  } else {
    //if (!currData?.userDFormActivities?.data?.length > 0) {
     currData.userDFormActivities = payload.response.userDFormActivities;
    //}
    currData.userDFormActivitiesSchedule = payload.response.userDFormActivitiesSchedule;
  }

  currData.key = payload.payload.key;
  if (currDataIndex === -1) {
      state.user.dashboard.data.push(currData);
    } else {
      state.user.dashboard.data[currDataIndex] = currData;
  }
}

const getDashboardDFormsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.dashboard.dForms = payload;
}

const getDashboardActivitySuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  let currDataIndex = state?.user?.dashboard?.data?.length > 0
    ? state?.user?.dashboard?.data.findIndex(item => item.key === payload.payload.key)
    : -1;
  let currData = currDataIndex === -1 ? {} : {...state?.user?.dashboard?.data[currDataIndex]}

  if (currData?.usersActivities && payload.response.usersActivities.current_page > currData.usersActivities.current_page) {
    let newData = currData.usersActivities.data.concat(payload.response.usersActivities.data)
    currData.usersActivities = payload.response.usersActivities;
    currData.usersActivities.data = newData;
  } else {
    //if (!currData?.usersActivities?.data?.length > 0) {
      currData.usersActivities = payload.response.usersActivities
    //}
    currData.usersActivitiesSchedule = payload.response.usersActivitiesSchedule;
  }
  currData.key = payload.payload.key;
  if (currDataIndex === -1) {
      state.user.dashboard.data.push(currData);
    } else {
      state.user.dashboard.data[currDataIndex] = currData;
  }
}

const postFilterSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  const newFilter = payload.response.data;
  newFilter.value.roles = new Set(newFilter.value.roles)
  newFilter.value.organizations = new Set(newFilter.value.organizations)
  let filters = state.user.filters;
  filters.push(newFilter);
  state.user.filters = filters;
  toast.success(`The filter set '${payload.response.data.value.filter_name}' was added`);
};

const getActivityTypesSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.activityTypes = payload
}

const patchFilterSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  let index = state.user.filters.findIndex(item => item.id === payload.payload.id);
  state.user.filters[index].data = payload.payload.newFilter;
  toast.success(`The filter set '${payload.payload.value.filter_name}' was updated`);
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
      payload.activity = manager.activity;
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
  filters = filters.filter(item => item.id !== payload.id);
  state.user.filters = filters;
  toast.success(`The filter set '${payload.value.filter_name}' was deleted`);
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
  if (state.user.managers[userIndex].id === state.user.manager.id) {
    state.user.manager.permissions = payload.result;
  }
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
  getActivitiesSuccess,
  deleteFilterSuccess,
  patchFilterSuccess,
  getUserPermissionsSuccess,
  setSearch,
  updateActivitiesSuccess,
  getDashboardDataSuccess,
  getActivityTypesSuccess,
  getDashboardActivitySuccess,
  getSettingsSuccess,
  postSettingsSuccess,
  patchSettingsSuccess,
  getDashboardDFormsSuccess,

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
