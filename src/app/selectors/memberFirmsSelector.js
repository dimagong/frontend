export const getMemberFirms = (state) => state.app.memberFirms;
export const getSelectedMemberFirm = (state) => (
  state?.app?.selectedMemberFirmId ? (
    state?.app?.memberFirms?.data.filter(memberFirm => memberFirm.id === state?.app?.selectedMemberFirmId)[0]
  ) : null
);
export const getSelectedMemberFirmUsers = (state) => state?.app?.selectedMemberFirmUsers;
export const getSelectedMemberFirmPotentialUsers = (state) => state?.app?.selectedMemberFirmPotentialUsers;

export const getSelectedMemberFirmMembers = (state) => state?.app?.selectedMemberFirmUsers?.member || [];
export const getSelectedMemberFirmPrincipals = (state) => state?.app?.selectedMemberFirmUsers?.principal || [];

export const getSelectedMemberFirmAllUsers = (state) => (
  [...getSelectedMemberFirmMembers(state), ...getSelectedMemberFirmPrincipals(state)]
);

export const getSelectedMemberFirmMSFields = (state) => state?.app?.selectedMemberFirmMSFields || [];
export const getSelectedMemberFirmFormFields = (state) => state?.app?.selectedMemberFirmFormFields || [];
