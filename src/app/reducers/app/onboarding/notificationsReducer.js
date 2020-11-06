const getNotificationsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const getNotificationsRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const getNotificationsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const createNotificationSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const createNotificationRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const createNotificationError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateNotificationSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const updateNotificationRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const updateNotificationError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const deleteNotificationSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const deleteNotificationRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const deleteNotificationError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};



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
