const getModulesSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.modules = payload;
};

export default {
  getModulesSuccess,
};
