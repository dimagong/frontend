const getModulesSuccess = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    user: {
      ...state.user,
      modules: payload
    }
  });
  
  const getModulesRequest = (state) => ({
    ...state,
    isLoading: true,
    isError: null,
    
  });
  const getModulesError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  
export default {
    getModulesSuccess,
    getModulesRequest,
    getModulesError,
  };