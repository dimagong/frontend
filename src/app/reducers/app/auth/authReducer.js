const loginSuccess = (state) => {
  state.isAuth = true;
  state.isLoading = false;
  state.isError = null;
};

const loginRequest = (state) => {
  state.isAuth = false;
  state.isLoading = true;
  state.isError = null;
};
const loginError = (state, { payload }) => {
  state.isAuth = false;
  state.isLoading = false;
  state.isError = payload;
};

const logout = (state) => {
  state.isAuth = false;
  state.isLoading = false;
  state.isError = null;
};

export default {
  loginSuccess,
  loginRequest,
  loginError,
  logout,
};
