const getRolesSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.roles = payload;
};

const getRolesRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const getRolesError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};


export default {
  getRolesSuccess,
  getRolesRequest,
  getRolesError,
  };
