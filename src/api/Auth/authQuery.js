import { useGenericMutation } from "../useGenericMutation";
import { createQueryKey } from "api/createQueryKey";
import { authDTO } from "./authDTO";

export const loginQueryKey = createQueryKey("login-query");
export const loginWithSecretCodeQueryKey = createQueryKey("login-with-secret-code");
export const invitationQueryKey = createQueryKey("invitation-accept");

export const loginQueryKeys = {
  all: () => [loginQueryKey],
};

export const loginWithSecretCodeQueryKeys = {
  all: () => [loginWithSecretCodeQueryKey],
};

export const invitationQueryKeys = {
  all: () => [invitationQueryKey],
};

export const useLoginQuery = (options) => {
  return useGenericMutation(
    {
      url: "/api/login",
      method: "post",
      queryKey: [loginQueryKey],
    },
    {
      select: authDTO.parse,
      ...options,
    }
  );
};

export const useLoginWithSecretCode = (options) => {
  return useGenericMutation(
    {
      url: "/api/login-two-factor",
      method: "post",
      queryKey: [loginWithSecretCodeQueryKey],
    },
    {
      select: authDTO.parse,
      ...options,
    }
  );
};

export const useInvitationAcceptQuery = (options) => {
  return useGenericMutation(
    {
      url: "/api/invitation/accept",
      method: "post",
      queryKey: [invitationQueryKey],
    },
    {
      select: authDTO.parse,
      ...options,
    }
  );
};
