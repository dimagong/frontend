export const getMemberFirms = (state) => state.app.memberFirms;
export const getSelectedMemberFirm = (state) => (
  state?.app?.selectedMemberFirmId ? (
    state?.app?.memberFirms.filter(memberFirm => memberFirm.id === state?.app?.selectedMemberFirmId)[0]
  ) : null
);
export const getSelectedMemberFirmUsers = (state) => state?.app?.selectedMemberFirmUsers;
// export const getSelectedMemberFirmPotentialUsers = (state) => state?.app?.selectedMemberFirmPotentialUsers;
export const getSelectedMemberFirmPotentialUsers = (state) => {
  if (state?.app?.selectedMemberFirmPotentialUsers) {
    const usersId = state?.app?.selectedMemberFirmPotentialUsers.map(user => user.id)

    return state?.app?.user?.managers.filter(user => usersId.includes(user.id));
  } else {
    return [];
  }
};

// export const getSelectedMemberFirmMembers = (state) => state?.app?.selectedMemberFirmUsers?.member || [];
export const getSelectedMemberFirmMembers = (state) => {
  if (state?.app?.selectedMemberFirmUsers?.member) {
    const usersId = state?.app?.selectedMemberFirmUsers?.member.map(user => user.id)

    return state?.app?.user?.managers.filter(user => usersId.includes(user.id));
  } else {
    return [];
  }
};

// export const getSelectedMemberFirmPrincipals = (state) => state?.app?.selectedMemberFirmUsers?.principal || [];
export const getSelectedMemberFirmPrincipals = (state) => {
  if (state?.app?.selectedMemberFirmUsers?.principal) {
    const usersId = state?.app?.selectedMemberFirmUsers?.principal.map(user => user.id)

    return state?.app?.user?.managers.filter(user => usersId.includes(user.id));
  } else {
    return [];
  }
};

export const getSelectedMemberFirmAllUsers = (state) => (
  [...getSelectedMemberFirmMembers(state), ...getSelectedMemberFirmPrincipals(state)]
);

export const getSelectedMemberFirmMSFields = (state) => state?.app?.selectedMemberFirmMSFields || [];
export const getSelectedMemberFirmFormFields = (state) => state?.app?.selectedMemberFirmFormFields || [];
export const getSelectedMemberFirmActivities = (state) => state?.app?.memberFirmActivities;
