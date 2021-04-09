const getInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitations = payload
};

const createInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  // todo list invitations was deleted
  // state.user.invitations = [payload, ...state.user.invitations];
  state.user.manager.invited = payload;

};

const deleteInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitations = state.user.invitations.filter( invitation => invitation.id === payload);
  state.user.manager.invited = null;
};

const revokeInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitations = state.user.invitations.map( invitation => invitation.id === payload.id ? {...invitation,...payload} : invitation)
};

const getInvitationSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitation = payload;
};

const sendInvitationAcceptSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

export default {
  getInvitationsSuccess,
  createInvitationsSuccess,
  deleteInvitationsSuccess,
  revokeInvitationsSuccess,
  getInvitationSuccess,
  sendInvitationAcceptSuccess,
};
