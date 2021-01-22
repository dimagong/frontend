export const selectGroups = state => state.app.user.groups
export const selectOrganizations = state => [...state.app.organizations.corporation, ...state.app.organizations.network, ...state.app.organizations.member_firm]
export const selectParentOrganizations = state => state.app.organizations.corporation
export const selectChildOrganizations = state => state.app.organizations.network
export const selectOrganizationEdit = state => selectOrganizations(state).filter((org) => (
  org.id === state.app.organizations.selectedOrganizationIdAndType.id &&
  org.type === state.app.organizations.selectedOrganizationIdAndType.type
))[0]
export const selectSelectedOrganizationIdAndType = state => state.app.organizations.selectedOrganizationIdAndType;
