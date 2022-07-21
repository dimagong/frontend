import { useDispatch, useSelector } from "react-redux";

import authService from "services/auth";
import appSlice from "app/slices/appSlice";
import { twoFactorAuthPath } from "constants/paths";

import { createQueryKey } from "api/createQueryKey";
import { useGenericMutation } from "api/useGenericMutation";
import { useRouter } from "../../hooks/useRouter";
import { selectInvitation } from "../../app/selectors";

export const AuthQueryKey = createQueryKey("Authentication");

export const AuthQueryKeys = {
  all: () => [AuthQueryKey],
};

const { loginRequest } = appSlice.actions;

export const useLoginMutation = (options = {}) => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  return useGenericMutation(
    {
      url: "/api/login",
      method: "post",
      queryKey: AuthQueryKeys.all(),
    },
    {
      onSuccess: (response) => {
        if (response.needs_2fa) {
          localStorage.setItem("tmp_token", response.tmp_token);
          push(twoFactorAuthPath);
        } else {
          authService.setToken(response.token);
          // login request needed because we have profile fetch
          // in redux-saga that currently not refactored to react-query
          dispatch(loginRequest());
        }
      },
      ...options,
    }
  );
};

export const use2FALoginMutation = (options = {}) => {
  const dispatch = useDispatch();
  return useGenericMutation(
    {
      url: "/api/login-two-factor",
      method: "post",
      queryKey: AuthQueryKeys.all(),
    },
    {
      onSuccess: (response) => {
        authService.setToken(response.token);
        // login request needed because we have profile fetch
        // in redux-saga that currently not refactored to react-query
        dispatch(loginRequest());
      },
      ...options,
    }
  );
};

export const useInvitationAcceptMutation = (options = {}) => {
  const login = useLoginMutation();
  const invitation = useSelector(selectInvitation);

  return useGenericMutation(
    {
      url: "/api/invitation/accept",
      method: "post",
      queryKey: AuthQueryKeys.all(),
    },
    {
      onSuccess: (_, payload) => {
        login.mutate({
          password: payload.password,
          remember_me: false,
          device_name: "browser",
          email: invitation.invitedUser.email,
        });
      },
      ...options,
    }
  );
};

export const useForgotPasswordMutation = (options) => {
  return useGenericMutation(
    {
      url: "/api/password/email",
      method: "post",
      queryKey: AuthQueryKeys.all(),
    },
    options
  );
};

export const usePasswordResetMutation = (options = {}) => {
  const login = useLoginMutation();

  return useGenericMutation(
    {
      url: "/api/password/reset",
      method: "post",
      queryKey: AuthQueryKeys.all(),
    },
    {
      onSuccess: (_, payload) => {
        login.mutate({
          email: payload.email,
          password: payload.password,
          device_name: "browser",
          remember_me: false,
        });
      },
      ...options,
    }
  );
};
