import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "../../api/useGenericQuery";
import { useGenericMutation } from "../../api/useGenericMutation";
import { useDispatch, useSelector } from "react-redux";
import onboardingSlice from "../../app/slices/onboardingSlice";
import appSlice from "../../app/slices/appSlice";
import { selectProfile } from "../../app/selectors";

// ToDo: Move it to organization queries scope.
// Organization Queries/Mutations

export const OrganizationsListQuery = createQueryKey("Organizations in dform");

export const OrganizationsQueryKeys = {
  all: () => [OrganizationsListQuery],
  byUserId: (userId) => [...OrganizationsQueryKeys.all(), { userId }],
};

export const useAllowedOrganizationsListQuery = (options) => {
  const userProfile = useSelector(selectProfile);
  const userId = userProfile?.id;

  return useGenericQuery(
    {
      url: `/api/organization/user/${userId}`,
      queryKey: OrganizationsQueryKeys.byUserId(userId),
    },
    {
      ...options,
      enabled: Boolean(userId),
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

const { setdForm } = onboardingSlice.actions;
const { getdFormsRequest } = appSlice.actions;

export const useApplicationsTemplatesQuery = (options) => {
  return useGenericQuery({ url: `api/dform-template`, queryKey: ApplicationQueryKeys.all() }, options);
};

export const useApplicationTemplateQuery = ({ applicationId }, options) => {
  return useGenericQuery(
    { url: `api/dform-template/${applicationId}`, queryKey: ApplicationQueryKeys.byId(applicationId) },
    options
  );
};

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

export const useCreateApplicationTemplateMutation = (options = {}) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    { url: `api/dform-template`, method: "post" },
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

export const useUpdateApplicationTemplateMutation = ({ applicationId }, options = {}) => {
  const dispatch = useDispatch();

  return useGenericMutation(
    { method: "put", url: `api/dform-template/${applicationId}`, queryKey: ApplicationQueryKeys.byId(applicationId) },
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

export const useApplicationResourceManagerFields = ({ organizationId, organizationType }, options) => {
  return useGenericQuery(
    {
      url: `api/dform-template/resource-manager-field?organizationId=${organizationId}&organizationType=${organizationType}`,
      queryKey: ApplicationQueryKeys.resourceManagerFields({ organizationId, organizationType }),
    },
    options
  );
};
