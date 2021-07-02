export const triggerTypesStrings = {
  dForm: "App\\DFormTrigger",
  survey: 'survey_trigger'
};
export const triggerTypes = [
  {type: "App\\DFormTrigger", label: "dForm"},
  {type: "survey_trigger", label: "survey"},
];

export const userTargetTypes = {
  subject: 'subject',
  managers: 'managers'
};

export const actionTypes = [
  {type: "App\\DFormAction", label: "dForm"},
  {type: "App\\NotificationTemplate", label: "notification"},
];

export const actionTypesByTriggerType = {
  "App\\DFormTrigger":  [
    {type: "App\\DFormAction", label: "dForm"},
    {type: "App\\NotificationTemplate", label: "notification"},
  ],
  survey_trigger: [
    {type: "App\\NotificationTemplate", label: "notification"},
  ]
};

export const triggerByTriggerType = {
  'App\\DFormTrigger': {
    trigger: 'App\\DFormTrigger',
    action: 'App\\DFormAction',
  },
  survey_trigger: {
    trigger: 'survey_trigger',
  },
};

export const types = {
  dform: {
    trigger: 'App\\DFormTrigger',
    action: 'App\\DFormAction',
  },
  survey: {
    trigger: 'survey_trigger',
  },
  notification: {
    action: 'App\\NotificationTemplate'
  }
};

export const userTypeOptions = [
  {value: "managers", label: "Users"},
  {value: "reviewer", label: "Reviewer"},
  {value: "subject", label: "Subject"}
];
export const initWorkflow = {name: '', description: "", triggers: [], groups: []};
