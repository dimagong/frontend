const getRolesSuccess = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    role: {
      ...state.role,
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