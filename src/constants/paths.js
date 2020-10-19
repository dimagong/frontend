import qs from "query-string"

export const loginPath = "/login";
export const homePath = "/";
export const forgotPasswordPath = "/forgot-password";
export const notificationsPath = "/onboarding/notifications";
export const processPath = "/onboarding-process";
export const dformsPath = "/onboarding/dforms";
export const workflowsPath = "/onboarding/workflows";
export const userManagmentPath = "/user-management";
export const userManagmentOptionsPath = id => `${userManagmentPath}?${qs.stringify({user_id: id}, {arrayFormat: 'comma'})}`;
export const invitationPath = "/invitation-accept/:invitationId";
export const masterSchemaPath = "/master-schema";
