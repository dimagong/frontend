const getModulesSuccess = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    module: {
      ...state.module,
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