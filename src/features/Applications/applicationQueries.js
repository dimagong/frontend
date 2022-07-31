import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "../../api/useGenericQuery";
import { useGenericMutation } from "../../api/useGenericMutation";

export const AllowedOrganizationsListQuery = createQueryKey("Allowed organizations query");
export const ApplicationCreateQuery = createQueryKey("Application create query");

export const OrganizationsQueryKeys = {
  all: () => [AllowedOrganizationsListQuery, ApplicationCreateQuery],
  getListById: ({ userId }) => [...AllowedOrganizationsListQuery, { userId }],
  create: () => [ApplicationCreateQuery],
};

export const useAllowedOrganizationsListQuery = ({ userId }, options) => {
  return useGenericQuery(
    {
      url: `/api/organization/user/${userId}`,
      queryKey: OrganizationsQueryKeys.getListById({ userId }),
    },
    options
  );
};

export const useApplicationCreateMutation = (options) => {
  return useGenericMutation(
    {
      url: `api/dform-template`,
      method: "post",
      queryKey: OrganizationsQueryKeys.create(),
    },
    {
      ...options,
    }
  );
};
