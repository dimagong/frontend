import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "../../api/useGenericQuery";
import { useGenericMutation } from "../../api/useGenericMutation";

export const AllowedOrganizationsListQuery = createQueryKey("Allowed organizations query");
export const ApplicationCreateQuery = createQueryKey("Application create query");
export const ApplicationGetQuery = createQueryKey("Application get query");
export const ApplicationUpdateQuery = createQueryKey("Application update query");

export const OrganizationsQueryKeys = {
  all: () => [AllowedOrganizationsListQuery, ApplicationCreateQuery, ApplicationGetQuery, ApplicationUpdateQuery],
  getListById: ({ userId }) => [...AllowedOrganizationsListQuery, { userId }],
  create: () => [ApplicationCreateQuery],
  update: () => [ApplicationUpdateQuery],
  getApplication: ({ applicationId }) => [ApplicationGetQuery, { applicationId }],
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

export const useApplicationUpdateMutation = ({ applicationId }, options) => {
  return useGenericMutation(
    {
      url: `api/dform-template/${applicationId}`,
      method: "put",
      queryKey: OrganizationsQueryKeys.update(),
    },
    {
      ...options,
    }
  );
};

export const useApplication = ({ applicationId }, options) => {
  return useGenericQuery(
    {
      url: `api/dform-template/${applicationId}`,
      queryKey: OrganizationsQueryKeys.getApplication({ applicationId }),
    },
    options
  );
};
