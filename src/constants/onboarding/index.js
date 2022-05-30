export const notificationPath = "/api/notification";

export const dFormTemplatePath = "/api/dform-template";
export const dFormPath = "/api/dform";
export const dFormActionsPath = "/api/dform/actions";
export const dFormTriggersPath = "/api/dform/triggers";
export const surveyTriggersPath = "/api/survey/triggers";
export const updateDFormFromParent = (id) => `api/dform/${id}/update-from-parent`;
export const submitdFormDataPath = (id) => `/api/dform/${id}/submit-data`;
export const submitdFormPath = (id) => `/api/dform/${id}/submit`;
export const submitdFormNewVersionPath = (id) => `/api/dform/${id}/save-current-version`;
export const changedFormStatusPath = (id) => `/api/dform/${id}/change-status`;
export const workflowPath = "/api/workflow";

export const groupsPath = "/api/group/all";
export const rolesPath = "/api/role/all";
export const modulesPath = "/api/module";
