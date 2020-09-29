const getProfileSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const getProfileRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const getProfileError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });
  const getUsersSuccess = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    user: {
      ...state.user,
      managers: payload
    }
  });
  
  const getUsersRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const getUsersError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });
  const setUser = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    user: {
      ...state.user,
      manager: payload
    }
  });

  
export default {
    getProfileSuccess,
    getProfileRequest,
    getProfileError,
    getUsersSuccess,
    getUsersRequest,
    getUsersError,
    setUser,
  };