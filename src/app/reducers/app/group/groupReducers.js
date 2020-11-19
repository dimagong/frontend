const getGroupsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.groups = payload;
};

const getGroupsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const getGroupsError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const getOrganizationsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}

const getOrganizationsSuccess = (state, {payload}) => {
  state.organizations.network = payload.network;
  state.organizations.corporation = payload.corporation;
  state.organizations.member_firm = payload.member_firm;
}

const getOrganizationsError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}

export default {
  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,

  getOrganizationsRequest,
  getOrganizationsSuccess,
  getOrganizationsError,
};
