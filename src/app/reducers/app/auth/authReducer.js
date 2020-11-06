import { logout as logoutService } from "services/auth/auth";

const loginSuccess = (state) => {
  state.isAuth = true;
  state.isLoading = false;
  state.isError = null;
};

const loginRequest = (state, {payload}) => {
  state.isAuth = false;
  state.isLoading = true;
  state.isError = null;
};
const loginError = (state , {payload}) => {

  state.isAuth = false;
  state.isLoading = false;
  state.isError = payload;
};

const logout = (state) => {
  logoutService();

  state.isAuth = false;
  state.isLoading = false;
  state.isError = null;

};

const resetPasswordSuccess = (state) => {

  state.isAuth = false;
  state.isLoading = false;
  state.isError = null;
};

const resetPasswordRequest = (state, {payload}) => {

  state.isAuth = false;
  state.isLoading = true;
  state.isError = null;
};
const resetPasswordError = (state, {payload}) => {

  state.isAuth = false;
  state.isLoading = false;
  state.isError = payload;
};
const verifyPasswordSuccess = (state) => {

  state.isAuth = false;
  state.isLoading = false;
  state.isError = null;
};

const verifyPasswordRequest = (state, {payload}) => {

  state.isAuth = false;
  state.isLoading = true;
  state.isError = null;
};
const verifyPasswordError = (state, {payload}) => {

  state.isAuth = false;
  state.isLoading = false;
  state.isError = payload;
};

export default {
  loginSuccess,
  loginRequest,
  loginError,
  logout,
  resetPasswordSuccess,
  resetPasswordRequest,
  resetPasswordError,
  verifyPasswordSuccess,
  verifyPasswordRequest,
  verifyPasswordError,
};
