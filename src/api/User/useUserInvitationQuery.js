import { useDispatch } from "react-redux";

import { useGenericMutation } from "api/useGenericMutation";

import { useGenericQuery } from "api/useGenericQuery";

import appSlice from "app/slices/appSlice";

import { createInvitationsPath, sendUserEmailPath } from "constants/user";

const { createInvitationsError, createInvitationsSuccess } = appSlice.actions;

export const UserInvitationKeys = {
  createInvitation: ["User create unvitation"],
  createIntitationId: (id) => [...UserInvitationKeys.createInvitation, id],
  sendEmailUser: ["Send email to user"],
  sendEmailUserId: (id) => [...UserInvitationKeys.sendEmailUser, id],
};

export const useCreateInvitationsMutation = (payload, options = {}) => {
  const dispatch = useDispatch();

  const { managerId, resend } = payload;

  return useGenericMutation(
    {
      url: createInvitationsPath({ managerId, resend }),
      method: "post",
      queryKey: [...UserInvitationKeys.createIntitationId(managerId)],
    },
    {
      onError: (error) => dispatch(createInvitationsError(error.message)),
      onSuccess: (data) => dispatch(createInvitationsSuccess(data)),
      ...options,
    }
  );
};

export const useSendEmailUserQuery = (payload, options = {}) => {
  const { invitationId } = payload;
  return useGenericQuery(
    {
      url: sendUserEmailPath(invitationId),
      queryKey: [...UserInvitationKeys.sendEmailUserId(invitationId)],
    },
    {
      ...options,
    }
  );
};
