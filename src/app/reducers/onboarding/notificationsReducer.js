  const setNotifications = (state , {payload}) => ({
    ...state,
    notification: {
      notifications: payload,
      notification: state.notification.notification
    }
  });

  const setNotification = (state, {payload}) => ({
    ...state,
    notification: {
      notifications: state.notification.notifications,
      notification: payload
    }
  });

  const setNotificationGroups = (state, {payload}) => ({
    ...state,
    notification: {
      notifications: state.notification.notifications,
      notification: {
        ...state.notification.notification,
        groups: payload
      }
    }
  })
  
export default {
    setNotifications,
    setNotification,
    setNotificationGroups
  };