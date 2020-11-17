export const selectGroups = state => state.app.user.groups
export const selectOrganizations = state => [...state.app.organizations.corporation, ...state.app.organizations.network, ...state.app.organizations.member_firm]
