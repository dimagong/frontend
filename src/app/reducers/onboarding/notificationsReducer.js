const setNotifications = (state, { payload }) => {
  state.notification.notifications = payload;
};

const setNotification = (state, { payload }) => {
  state.notification.notification = payload;
};

const setNotificationGroups = (state, { payload }) => {
  state.notification.notification.groups = payload;
};

export default {
  setNotifications,
  setNotification,
  setNotificationGroups,
};
