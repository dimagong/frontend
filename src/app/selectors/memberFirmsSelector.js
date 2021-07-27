export const getMemberFirms = (state) => state.app.memberFirms;
export const getSelectedMemberFirm = (state) => (
  state?.app?.selectedMemberFirmId ? (
    state?.app?.memberFirms?.data.filter(memberFirm => memberFirm.id === state?.app?.selectedMemberFirmId)[0]
  ) : null
);
