import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "../../api/useGenericQuery";

export const AllowedOrganizationsListQuery = createQueryKey("Allowed organizations query");

export const OrganizationsQueryKeys = {
  all: () => [AllowedOrganizationsListQuery],
  getListById: ({ userId }) => [...AllowedOrganizationsListQuery, { userId }],
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
