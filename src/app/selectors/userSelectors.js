export const selectManagers = state => state?.app?.user?.managers
export const selectManager = state => state?.app?.user?.manager
export const selectUserWorkfows = state => state?.app?.user?.workflows
export const selectUserDForms = state => state?.app?.user?.dForms
export const selectUserReviewers = state => state?.app?.user?.reviewers
export const selectModules = state => state?.app?.user?.modules
export const selectRoles = state => state?.app?.user?.roles
export const selectGroups = state => state?.app?.user?.groups
export const selectUser = state => state?.app?.user?.user
export const selectInvitations = state => state?.app?.user?.invitations
export const selectInvitation = state => state?.app?.user?.invitation
export const selectProfile = state => state?.app?.user?.profile
export const selectVuexyUser = state => state?.vuexy?.auth?.login?.values?.user
export const selectUserOrganizations = userId => state => {
  const user = state.app.user.managers.filter(({id}) => id === userId)[0]
  return [...(user?.organizations?.corporation || []), ...(user?.organizations?.network || []), ...(user?.organizations?.member_firm || [])]
}
export const selectUserParentOrganizations = userId => state => {
  const user = state.app.user.managers.filter(({id}) => id === userId)[0]

  return user?.organizations?.corporation || []
}
export const selectUserChildOrganizations = userId => state => {
  const user = state.app.user.managers.filter(({id}) => id === userId)[0]

  return user?.organizations?.network || []
}

export const selectUserAbility = state => state?.app?.user?.profile?.permissions?.ability
