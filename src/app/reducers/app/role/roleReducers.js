const getRolesSuccess = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    user: {
      ...state.user,
      roles: payload
    }
  });
  
  const getRolesRequest = (state) => ({
    ...state,
    isLoading: true,
    isError: null,
    
  });
  const getRolesError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  
export default {
  getRolesSuccess,
  getRolesRequest,
  getRolesError,
  };