export const selectGroups = state => state.app.user.groups
export const selectOrganizations = state => state.app.organizations
export const selectParentOrganizations = state => state.app.organizations.corporation
export const selectChildOrganizations = state => state.app.organizations.network
