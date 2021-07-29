export const getMemberFirms = (state) => state.app.memberFirms;
export const getSelectedMemberFirm = (state) => (
  state?.app?.selectedMemberFirmId ? (
    state?.app?.memberFirms?.data.filter(memberFirm => memberFirm.id === state?.app?.selectedMemberFirmId)[0]
  ) : null
);
export const getSelectedMemberFirmUsers = (state) => state?.app?.selectedMemberFirmUsers
export const getSelectedMemberFirmPotentialUsers = (state) => state?.app?.selectedMemberFirmPotentialUsers
