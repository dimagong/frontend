export const triggerTypes = [{ type: "App\\DFormTrigger", label: "dForm" }];

export const userTargetTypes = {
  subject: 'subject',
  managers: 'managers'
}

export const actionTypes = [
  { type: "App\\DFormAction", label: "dForm" },
  { type: "App\\NotificationTemplate", label: "notification" },
];

export const types = {
  dform: {
    trigger: 'App\\DFormTrigger',
    action: 'App\\DFormAction',
  },
  notification: {
    action: 'App\\NotificationTemplate'
  }
}

export const userTypeOptions = [
  {value: "managers", label: "Users"},
  {value: "reviewer", label: "Reviewer"},
  {value: "subject", label: "Subject"}
]