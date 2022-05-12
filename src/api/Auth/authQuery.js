import { useGenericMutation } from "../useGenericMutation";
import { createQueryKey } from "api/createQueryKey";
import { authDTO } from "./authDTO";

const loginQueryKey = createQueryKey("login-query");
const loginWithSecretCodeQueryKey = createQueryKey("login-with-secret-code");

export const useLoginQuery = (options) => {
  return useGenericMutation(
    {
      url: "/api/login",
      method: "post",
      queryKey: loginQueryKey,
    },
    {
      ...options,
      select: authDTO.parse,
    },
  )
};

export const useLoginWithSecretCode = (options) => {
  return useGenericMutation(
    {
      url: "/api/login-two-factor",
      method: "post",
      queryKey: loginWithSecretCodeQueryKey,
    },
    {
      ...options,
      select: authDTO.parse,
    },
  )
};
