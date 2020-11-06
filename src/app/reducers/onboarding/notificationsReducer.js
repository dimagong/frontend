const setNotifications = (state , {payload}) => {
  state.notification.notifications = payload;

  // part from old code, what is that for ??
  // state.notification.notification = state.notification.notification
};

const setNotification = (state, {payload}) => {

  // Same thing from old code, what is that for ??
  // state.notification.notifications = state.notification.notifications;

  state.notification.notification = payload;
};

const setNotificationGroups = (state, {payload}) => {
  // And same again
  // state.notification.notifications = state.notification.notifications;
  state.notification.groups = payload
}

export default {
    setNotifications,
    setNotification,
    setNotificationGroups
  };
