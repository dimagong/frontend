const getModulesSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.modules = payload;
};

const getModulesRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const getModulesError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};


export default {
    getModulesSuccess,
    getModulesRequest,
    getModulesError,
  };
