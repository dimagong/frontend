const getInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitations = payload
};
const getInvitationsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const getInvitationsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const createInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitations = [payload, ...state.user.invitations];
};
const createInvitationsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const createInvitationsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const deleteInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitations = state.user.invitations.filter( invitation => invitation.id === payload);
  state.user.manager = {...state.user.manager, invited: null};
};
const deleteInvitationsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const deleteInvitationsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const revokeInvitationsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitations = state.user.invitations.map( invitation => invitation.id === payload.id ? {...invitation,...payload} : invitation)
};
const revokeInvitationsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const revokeInvitationsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const getInvitationSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.invitation = payload;
};
const getInvitationRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const getInvitationError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const sendInvitationAcceptSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
};
const sendInvitationAcceptRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const sendInvitationAcceptError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

export default {
  getInvitationsSuccess,
  getInvitationsRequest,
  getInvitationsError,
  createInvitationsSuccess,
  createInvitationsRequest,
  createInvitationsError,
  deleteInvitationsSuccess,
  deleteInvitationsRequest,
  deleteInvitationsError,
  revokeInvitationsSuccess,
  revokeInvitationsRequest,
  revokeInvitationsError,
  getInvitationSuccess,
  getInvitationRequest,
  getInvitationError,
  sendInvitationAcceptSuccess,
  sendInvitationAcceptRequest,
  sendInvitationAcceptError,
  };
