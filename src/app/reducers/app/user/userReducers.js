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
    users: state.user.users,
    user: {
      ...state.user.user,
      groups: payload
    }
  }
})
const setUserModules = (state, {payload}) => ({
  ...state,
  user: {
    users: state.user.users,
    user: {
      ...state.user.user,
      modules: payload
    }
  }
})
const setUserRoles = (state, {payload}) => ({
  ...state,
  user: {
    users: state.user.users,
    user: {
      ...state.user.user,
      roles: payload
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
  setUserGroups,
  setUserModules,
  setUserRoles,
};
