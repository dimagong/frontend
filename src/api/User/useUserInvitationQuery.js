import { useDispatch } from "react-redux";
import { useGenericMutation } from "api/useGenericMutation";
import appSlice from "app/slices/appSlice";
import { createInvitationsPath } from "constants/user";
const { createInvitationsError, createInvitationsSuccess } = appSlice.actions;

export const UserInvitationKeys = {
  createInvitation: ["User create unvitation"],
  createIntitationId: (id) => [...UserInvitationKeys.createInvitation, id],
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
      onError: (error) => {
        console.log("useCreateInvitationsMutation ERROR", error);
        dispatch(createInvitationsError(error.message));
      },
      onSuccess: (data) => {
        console.log("useCreateInvitationsMutation SUCCESSFUL", data);
        dispatch(createInvitationsSuccess(data));
      },
      ...options,
    }
  );
};
