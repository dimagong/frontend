const getGroupsSuccess = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    user: {
      ...state.user,
      groups: payload
    }
  });
  
  const getGroupsRequest = (state) => ({
    ...state,
    isLoading: true,
    isError: null,
    
  });
  const getGroupsError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  
export default {
  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,
  };