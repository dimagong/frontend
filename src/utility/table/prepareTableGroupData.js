export const prepareTableGroupData = (notifications) => {
  const concatGroups = (notification) =>
    notification.groups.length ? notification.groups.map((group) => group.name).join(", ") : "none";
  return notifications.map((notification) => ({ ...notification, groups: concatGroups(notification) }));
};
