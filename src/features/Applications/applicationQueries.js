import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "../../api/useGenericQuery";
import { useGenericMutation } from "../../api/useGenericMutation";
import { useDispatch } from "react-redux";
import onboardingSlice from "../../app/slices/onboardingSlice";
import appSlice from "../../app/slices/appSlice";

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
  resourceManagerFields: ({ organizationId, organizationType }) => [
    ...ApplicationQueryKeys.all(),
    "resource-manager-fields",
    { organizationId, organizationType },
  ],
};

export const useApplicationsTemplatesQuery = (options) => {
  return useGenericQuery({ url: `api/dform-template`, queryKey: ApplicationQueryKeys.all() }, options);
};

export const useApplicationTemplate = ({ applicationId }, options) => {
  return useGenericQuery(
    { url: `api/dform-template/${applicationId}`, queryKey: ApplicationQueryKeys.byId(applicationId) },
    options
  );
};

const { setdForm } = onboardingSlice.actions;
const { getdFormsRequest } = appSlice.actions;

export const useCopyApplicationTemplateMutation = ({ applicationId }, options = {}) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    { url: `api/dform-template/${applicationId}/copy`, method: "post" },
    {
      ...options,
      onSuccess: (data, ...rest) => {
        dispatch(setdForm(data));
        dispatch(getdFormsRequest());
        options.onSuccess && options.onSuccess(data, ...rest);
      },
    }
  );
};

// Currently do not need to re-invalidate query due to components implementation
export const useApplicationTemplateCreateMutation = (options) => {
  return useGenericMutation({ url: `api/dform-template`, method: "post" }, options);
};

// Currently do not need to re-invalidate query due to components implementation
export const useApplicationTemplateUpdateMutation = ({ applicationId }, options) => {
  return useGenericMutation({ method: "put", url: `api/dform-template/${applicationId}` }, options);
};

export const useApplicationResourceManagerFields = ({ organizationId, organizationType }, options) => {
  return useGenericQuery(
    {
      url: `api/dform-template/resource-manager-field?organizationId=${organizationId}&organizationType=${organizationType}`,
      queryKey: ApplicationQueryKeys.resourceManagerFields({ organizationId, organizationType }),
    },
    options
  );
};
