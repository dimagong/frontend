import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";
import { createQueryKey } from "api/createQueryKey";
import { useGenericMutation } from "api/useGenericMutation";

import { useFileQuery } from "./useFileQueries";

const {
  updateMemberFirmProfileImageSuccess,
  updateMemberFirmProfileImageError,
  removeMemberFirmLogoSuccess,
  removeMemberFirmLogoError,
} = appSlice.actions;

export const MemberFirmLogoQueryKey = createQueryKey("MemberFirm logo");

export const MemberFirmLogoQueryKeys = {
  all: () => [MemberFirmLogoQueryKey],
  logo: (memberFormId) => [...MemberFirmLogoQueryKeys.all(), memberFormId],
};

export const useMemberFirmLogoQuery = ({ memberFirmId }, options) => {
  return useFileQuery(
    { url: `api/files/member-firm/${memberFirmId}/logo`, queryKey: MemberFirmLogoQueryKeys.logo(memberFirmId) },
    options
  );
};

export const useUpdateMemberFirmLogoMutation = ({ memberFirmId }, options = {}) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    {
      url: `/api/member-firm/${memberFirmId}/logo`,
      method: "post",
      queryKey: MemberFirmLogoQueryKeys.logo(memberFirmId),
      transformData: ({ file }) => {
        const formData = new FormData();

        formData.set("logo", file);
        // laravel can`t see form data values when method PUT, so
        formData.append("_method", "put");

        return formData;
      },
    },
    {
      // [It needs refactor]
      // Warn, it needs while MemberFirm do not update from queries
      onError: (error) => dispatch(updateMemberFirmProfileImageError(error)),
      onSuccess: (data) => dispatch(updateMemberFirmProfileImageSuccess(data)),
    }
  );
};

export const useDeleteMemberFirmLogoMutation = ({ memberFirmId }, options) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    {
      url: `/api/member-firm/${memberFirmId}/logo`,
      method: "delete",
      queryKey: MemberFirmLogoQueryKeys.logo(memberFirmId),
    },
    {
      // [It needs refactor]
      // Warn, it needs while user.managers do not update from queries
      onError: (error) => dispatch(removeMemberFirmLogoError(error)),
      onSuccess: (data) => dispatch(removeMemberFirmLogoSuccess(data)),
    }
  );
};
