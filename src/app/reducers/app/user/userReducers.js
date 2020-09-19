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


  
export default {
    getProfileSuccess,
    getProfileRequest,
    getProfileError,
  };