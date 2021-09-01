export const selectNotifications = (state) => state.onboarding.notification.notifications;
export const selectNotification = (state) => state.onboarding.notification.notification;

export const selectdForms = (state) => state.onboarding.dForm.dForms;
export const selectdForm = (state) => state.onboarding.dForm.dForm;
export const selectdFormTriggers = (state) =>  state.onboarding.dForm.triggers;
export const selectSurveyTriggers = (state) =>  state.onboarding.survey.triggers;
export const selectdFormActions = (state) =>  state.onboarding.dForm.actions;

export const selectWorkflows = (state) => state.onboarding.workflow.workflows;
export const selectAllowedUserList = (state) => state.onboarding.workflow.allowedUserList;
export const selectWorkflow = (state) => state.onboarding.workflow.workflow;

export const selectApplicationWorkFlows = (state) => state.onboarding.workflow.workflows.filter(workflow => workflow.context === "application");
export const selectSurveyWorkFlows = (state) => state.onboarding.workflow.workflows.filter(workflow => workflow.context === "survey");
