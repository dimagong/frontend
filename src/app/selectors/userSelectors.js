import _ from "lodash/fp";
import { initialUserMasterSchemaHierarchySearchParams } from "../slices/appSlice";

export const selectManagers = state => state?.app?.user?.managers;
export const selectManager = state => state?.app?.user?.manager;

//* TODO refactor selectManager to select manager by id from managers array
export const selectCurrentManager = state => {
  return state?.app?.user?.managers.filter((manager) => manager.id === state?.app?.user?.manager?.id)[0];
};

export const selectManagerById = id => state => state?.app?.user?.managers.filter(manager => manager.id === id)[0];

export const selectUserWorkflows = state => state?.app?.user?.workflows;
export const selectUserDForms = state => state?.app?.user?.dForms;
export const selectUserReviewers = state => state?.app?.user?.reviewers;
export const selectModules = state => state?.app?.user?.modules;
export const selectRoles = state => state?.app?.user?.roles;
export const selectGroups = state => state?.app?.user?.groups;
export const selectUser = state => state?.app?.user?.user;
export const selectInvitations = state => state?.app?.user?.invitations;
export const selectInvitation = state => state?.app?.user?.invitation;
export const selectProfile = state => state?.app?.user?.profile;
export const selectVuexyUser = state => state?.vuexy?.auth?.login?.values?.user;
export const selectUserOrganizations = userId => state => {
  const user = state.app.user.managers.filter(({id}) => id === userId)[0];
  return [
    ...(user?.organizations?.corporation || []),
    ...(user?.organizations?.network || []),
    ...(user?.organizations?.member_firm || [])
  ]
};
export const selectUserParentOrganizations = userId => state => {
  const user = state.app.user.managers.filter(({id}) => id === userId)[0];

  return user?.organizations?.corporation || []
};
export const selectUserChildOrganizations = userId => state => {
  const user = state.app.user.managers.filter(({id}) => id === userId)[0];

  return user?.organizations?.network || []
};

export const selectUserAbility = state => state?.app?.user?.profile?.permissions?.ability;

export const selectUserOnboarding = state => state?.app?.user?.profile?.onboarding;

export const selectFilters = state => state?.app?.user?.filters.data;
export const selectFiltersId = state => state?.app?.user?.filters.id;

export const selectSearchText = state => state?.app?.user?.searchText;

export const selectUserActivity = userId => state => state?.app?.user?.managers.find(item => item.id === userId).activity;
export const selectDashboardData = state => state?.app?.user?.dashboard?.data;
export const selectDashboardDataByKey = key => state => state?.app?.user?.dashboard?.data?.length > 0
  ? state?.app?.user?.dashboard?.data.find(item => item.key === key)
  : null;
export const selectDashboardSettings = state => state?.app?.user?.dashboard?.settings;
export const selectDashboardDForms = state => state?.app?.user?.dashboard?.dForms;
export const selectActivityTypes = state => state?.app?.user?.activityTypes;

export const selectSurveys = state => state?.app?.surveys;
export const selectSelectedSurvey = state => state?.app?.selectedSurvey;
export const selectFolders = state => state?.app?.folders;
export const selectQuestionVersions = state => state?.app?.selectedQuestionVersions;
export const selectSurveyVersions = state => state?.app?.selectedSurveyVersions;
export const selectSurveyWorkFlowsAndReviewers = state => state?.app?.surveyWorkFlowsAndReviewers;
export const selectSelectedManagerAssignedSurveys = state => state?.app?.selectedManagerAssignedSurveys;
export const selectOnboardingSurveys = state => state?.app?.onboardingSurveys;
export const selectAssignedSurveyById = (id) => state => state?.app?.selectedManagerAssignedSurveys.filter(survey => survey.id === id)[0];
export const selectOnboardingSurveyStats = (id) => state => state?.app?.onboardingSurveys.filter(os => os.id === id)[0].stats;

export const selectUserMasterSchemaHierarchy = _.get("app.user.masterSchema.hierarchy");
export const selectUserMasterSchemaHierarchySearchParams = _.get("app.user.masterSchema.hierarchySearchParams");

const isUserMasterSchemaHierarchySearchParamsInitial = (searchParams) =>
  _.keys(searchParams).every((key) => {
    const current = searchParams[key];
    const expected = initialUserMasterSchemaHierarchySearchParams[key];
    return _.isEqual(current, expected);
  });

export const selectIsUserMasterSchemaHierarchySearchParamsInitial = _.pipe(selectUserMasterSchemaHierarchySearchParams, isUserMasterSchemaHierarchySearchParamsInitial);
