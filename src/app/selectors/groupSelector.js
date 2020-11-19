export const selectGroups = state => state.app.user.groups
export const selectOrganizations = state => [...state.app.organizations.corporation, ...state.app.organizations.network, ...state.app.organizations.member_firm]
export const selectParentOrganizations = state => state.app.organizations.corporation
export const selectChildOrganizations = state => state.app.organizations.network
