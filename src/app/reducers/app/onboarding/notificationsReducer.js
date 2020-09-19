const getNotificationsSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const getNotificationsRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const getNotificationsError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const createNotificationSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const createNotificationRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const createNotificationError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const updateNotificationSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const updateNotificationRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const updateNotificationError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const deleteNotificationSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const deleteNotificationRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const deleteNotificationError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });


  
export default {
  getNotificationsSuccess,
  getNotificationsRequest,
  getNotificationsError,
  createNotificationSuccess,
  createNotificationRequest,
  createNotificationError,
  updateNotificationSuccess,
  updateNotificationRequest,
  updateNotificationError,
  deleteNotificationSuccess,
  deleteNotificationRequest,
  deleteNotificationError,
  };