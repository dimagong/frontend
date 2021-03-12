import {toast} from 'react-toastify'

const getNotificationsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const createNotificationSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Created")
};

const updateNotificationSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Saved")
};

const deleteNotificationSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

export default {
  getNotificationsSuccess,
  createNotificationSuccess,
  updateNotificationSuccess,
  deleteNotificationSuccess,
};

