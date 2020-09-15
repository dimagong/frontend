import { logout as logoutService } from "services/auth/auth";

const loginSuccess = (state) => ({
  ...state,
  isAuth: true,
  isLoading: false,
  isError: false,
});

const loginRequest = (state, {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: true,
  isError: false,
});
const loginError = (state) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: true,
});

const logout = (state) => {
  logoutService();
return {
  ...state,
  isAuth: false,
  isLoading: false,
  isError: false,
}};

const resetPasswordSuccess = (state) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: false,
});

const resetPasswordRequest = (state, {payload}) => ({
  ...state,
  isAuth: false,
  isLoading: true,
  isError: false,
});
const resetPasswordError = (state) => ({
  ...state,
  isAuth: false,
  isLoading: false,
  isError: true,
});


export default {
  loginSuccess,
  loginRequest,
  loginError,
  logout,
  resetPasswordSuccess,
  resetPasswordRequest,
  resetPasswordError,
};
