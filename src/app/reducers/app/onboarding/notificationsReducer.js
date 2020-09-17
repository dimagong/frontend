const notificationsSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const notificationsRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const notificationsError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const setNotifications = (state) => ({
    ...state,
  });

  const setNotification = (state) => ({
    ...state,
  });


  
export default {
    notificationsSuccess,
    notificationsRequest,
    notificationsError,
    setNotifications,
    setNotification,
  };