const getGroupsSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const getGroupsRequest = (state, {payload}) => ({
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