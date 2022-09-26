import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";
import { createQueryKey } from "api/createQueryKey";
import { useGenericMutation } from "api/useGenericMutation";

import { useFileQuery } from "./useFileQueries";

const { updateUserAvatarSuccess, updateUserAvatarError, deleteUserAvatarSuccess, deleteUserAvatarError } =
  appSlice.actions;

export const UserAvatarQueryKey = createQueryKey("User avatar");

export const UserAvatarQueryKeys = {
  all: () => [UserAvatarQueryKey],
  avatar: (userId) => [...UserAvatarQueryKeys.all(), userId],
};

export const useUserAvatarQuery = ({ userId, isOnboarding }, options) => {
  const apiPrefix = isOnboarding ? "member-view-api" : "api";
  return useFileQuery(
    { url: `${apiPrefix}/file/user/${userId}/avatar`, queryKey: UserAvatarQueryKeys.avatar(userId) },
    options
  );
};

export const useUpdateUserAvatarMutation = ({ userId }, options = {}) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    {
      url: `/api/file/user/${userId}/avatar`,
      method: "post",
      queryKey: UserAvatarQueryKeys.avatar(userId),
      transformData: ({ file }) => {
        const formData = new FormData();

        formData.set("avatar", file);

        return formData;
      },
    },
    {
      // [It needs refactor]
      // Warn, it needs while user.managers do not update from queries
      onError: (error) => dispatch(updateUserAvatarError(error)),
      onSuccess: (avatar) => dispatch(updateUserAvatarSuccess({ managerId: userId, avatar })),
    }
  );
};

export const useDeleteUserAvatarMutation = ({ userId, fileId }, options) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    { url: `/api/file/${fileId}`, method: "delete", queryKey: UserAvatarQueryKeys.avatar(userId) },
    {
      // [It needs refactor]
      // Warn, it needs while user.managers do not update from queries
      onError: (error) => dispatch(deleteUserAvatarError(error)),
      onSuccess: () => dispatch(deleteUserAvatarSuccess({ managerId: userId })),
    }
  );
};
