import { logout as logoutService } from "services/auth/auth";

const loginSuccess = (state) => ({
  ...state,
  isAuth: true,
  isLoading: false,
  isError: null,
});

const loginRequest = (state, {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: true,
  isError: null,
});
const loginError = (state , {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: payload,
});

const logout = (state) => {
  logoutService();
return {
  ...state,
  isAuth: false,
  isLoading: false,
  isError: null,
}};

const resetPasswordSuccess = (state) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: null,
});

const resetPasswordRequest = (state, {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: true,
  isError: null,
});
const resetPasswordError = (state, {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: payload,
});
const verifyPasswordSuccess = (state) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: null,
});

const verifyPasswordRequest = (state, {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: true,
  isError: null,
});
const verifyPasswordError = (state, {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: payload,
});


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
