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

export default {
  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,
};
