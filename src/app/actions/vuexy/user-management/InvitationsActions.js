export const setInvitationsList = (invitations) => {
  return {
    type: "SET_INVITATIONS_LIST",
    payload: {
      list: invitations,
    },
  };
};
