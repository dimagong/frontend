const getProfileSuccess = (state) => ({
  ...state,
  isLoading: false,
  isError: null,
});

const getProfileRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const getProfileError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const getUsersSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    managers: payload,
  },
});

const getUsersRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const getUsersError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const updateUserSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    managers: state.user.managers.map( manager => manager.id === state.user.manager.id ? payload : manager ),
  },
});

const updateUserRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const updateUserError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const updateUserAvatarSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: {...this.state.user.manager,...payload},
  },
});
const updateUserAvatarRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const updateUserAvatarError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const deleteUserAvatarSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: {...this.state.user.manager,...payload},
  },
});
const deleteUserAvatarRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const deleteUserAvatarError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const getUserAvatarSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: {...this.state.user.manager,...payload},
  },
});
const getUserAvatarRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const getUserAvatarError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const getUserOnboardingSuccess = (state, { payload: {dForms, workflows, reviewers} }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    workflows,
    dForms,
    reviewers
  }
});
const getUserOnboardingRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const getUserOnboardingError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const createUserOnboardingSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  // user: {
  //   ...state.user,
  //   manager: {
  //   ...state.user.manager,
  //     onboardings: [...state.user.manager.onboardings, {payload}],
  //     onboarding: null,
  //   },
  //   managers: state.user.managers.map( manager => manager.id === state.user.manager.id ? {...manager, onboardings: [...manager.onboardings, payload]} : manager)
  // }
});
const createUserOnboardingRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const createUserOnboardingError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const deleteUserOnboardingSuccess = (state, { payload}) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: {
      ...state.user.manager,
        onboardings: state.user.manager.onboardings.filter(oboarding => oboarding.id !== payload.id),
        onboarding: null,
      },
      managers: state.user.managers.map( manager => manager.id === state.user.manager.id ? {...manager, onboardings: manager.onboardings.filter(oboarding => oboarding.id !== payload.id)} : manager)
    }
});
const deleteUserOnboardingRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const deleteUserOnboardingError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const updateUserRolesSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: {...state.user.manager,...payload},
  },
});
const updateUserRolesRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const updateUserRolesError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const updateUserGroupsSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: {...state.user.manager,...payload},
  },
});
const updateUserGroupsRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const updateUserGroupsError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

const updateUserModulesSuccess = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: {...state.user.manager,...payload},
  },
});
const updateUserModulesRequest = (state, { payload }) => ({
  ...state,
  isLoading: true,
  isError: null,
});
const updateUserModulesError = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: payload,
});

// TODO: SETTERS

const setUser = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isError: null,
  user: {
    ...state.user,
    manager: payload,
  },
});
const setUserGroups = (state, {payload}) => ({
  ...state,
  user: {
    ...state.user,
    groups: payload
  }
})
const setUserModules = (state, {payload}) => ({
  ...state,
  user: {
    ...state.user,
      modules: payload
  }
})
const setUserRoles = (state, {payload}) => ({
  ...state,
    user: {
      ...state.user,
      roles: payload
    }
})

const setManagerOnboarding = (state, {payload}) => ({
  ...state,
  user: {
      ...state.user,
    manager: {
      ...state.user.manager,
      onboarding: payload
    }
  }
})

const setManagerOnboardingProperty = (state, {payload}) => ({
  ...state,
  user: {
      ...state.user,
      manager: {
      ...state.user.manager,
      onboarding: {
        ...state.user.manager.onboarding,
        ...payload
      }
    }
  }
})
const setUserDForms = (state, {payload}) => ({
  ...state,
  user: {
      ...state.user,
      manager: {
      ...state.user.manager,
      onboarding: {
        ...state.user.manager.onboarding,
        d_form: payload
      }
    }
  }
})

const setUserWorkflows = (state, {payload}) => ({
  ...state,
  user: {
      ...state.user,
      manager: {
      ...state.user.manager,
      onboarding: {
        ...state.user.manager.onboarding,
        workflow: payload
      }
    }
  }
})

const setUserReviewers = (state, {payload}) => ({
  ...state,
  user: {
      ...state.user,
      manager: {
      ...state.user.manager,
      onboarding: {
        ...state.user.manager.onboarding,
        reviewers: payload
      }
    }
  }
})

export default {
  getProfileSuccess,
  getProfileRequest,
  getProfileError,
  getUsersSuccess,
  getUsersRequest,
  getUsersError,
  updateUserSuccess,
  updateUserRequest,
  updateUserError,
  setUser,
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
  updateUserGroupsSuccess,
  updateUserGroupsRequest,
  updateUserGroupsError,
  updateUserModulesSuccess,
  updateUserModulesRequest,
  updateUserModulesError,
  setUserGroups,
  setUserModules,
  setUserRoles,
  setManagerOnboardingProperty, 
  setManagerOnboarding,
  setUserDForms, 
  setUserWorkflows,
  setUserReviewers,
  
};
