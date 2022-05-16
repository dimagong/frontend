import { useGenericMutation } from "../useGenericMutation";
import { createQueryKey } from "api/createQueryKey";
import { authDTO } from "./authDTO";

const loginQueryKey = createQueryKey("login-query");
const loginWithSecretCodeQueryKey = createQueryKey("login-with-secret-code");
const invitationQueryKey = createQueryKey("invitation-accept");

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
      flatData: true,
    },
    {
      select: authDTO.parse,
      ...options,
    }
  );
};
