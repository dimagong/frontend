export const selectContextSearchVisibility = (state) => state?.app?.isContextSearchVisible;
export const selectContext = (state) => state?.app?.context;
export const selectPreview = (state) => state?.app?.preview;
export const selectNotificationsAndWorkFlowsContext = (state) => state?.app?.notificationsAndWorkFlowContext || "dForm";
