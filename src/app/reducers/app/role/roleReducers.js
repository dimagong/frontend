const getRolesSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.roles = payload;
};

export default {
  getRolesSuccess,
};
