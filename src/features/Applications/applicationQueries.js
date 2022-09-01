import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "../../api/useGenericQuery";
import { useGenericMutation } from "../../api/useGenericMutation";

// ToDo: Move it to organization queries scope.
// Organization Queries/Mutations

export const OrganizationsListQuery = createQueryKey("Organizations in dform");

export const OrganizationsQueryKeys = {
  all: () => [OrganizationsListQuery],
  byUserId: (userId) => [...OrganizationsQueryKeys.all(), { userId }],
};

export const useAllowedOrganizationsListQuery = ({ userId }, options) => {
  return useGenericQuery(
    {
      url: `/api/organization/user/${userId}`,
      queryKey: OrganizationsQueryKeys.byUserId(userId),
    },
    {
      staleTime: 0,
      // To prevent cases when organization create or update mutations do not invalidate that query
      // set staleTime to 0 to re-fetch it always.
      ...options,
    }
  );
};

// Application Queries/Mutations

export const ApplicationQueryKey = createQueryKey("Application");

export const ApplicationQueryKeys = {
  all: () => [ApplicationQueryKey],
  byId: (applicationId) => [...ApplicationQueryKeys.all(), { applicationId }],
};

// Currently do not need to re-invalidate query due to components implementation
export const useApplicationTemplateCreateMutation = (options) => {
  return useGenericMutation({ url: `api/dform-template`, method: "post" }, options);
};

// Currently do not need to re-invalidate query due to components implementation
export const useApplicationTemplateUpdateMutation = ({ applicationId }, options) => {
  return useGenericMutation({ method: "put", url: `api/dform-template/${applicationId}` }, options);
};

export const useApplicationTemplate = ({ applicationId }, options) => {
  return useGenericQuery(
    { url: `api/dform-template/${applicationId}`, queryKey: ApplicationQueryKeys.byId(applicationId) },
    options
  );
};
