import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useGenericMutation } from "api/useGenericMutation";
import { useDispatch } from "react-redux";
import onboardingSlice from "app/slices/onboardingSlice";
import appSlice from "app/slices/appSlice";
import { DFormTemplateCategoryQueryKeys } from "features/home/ContextSearch/Applications/categoryQueries";

// ToDo: Move it to organization queries scope.
// Organization Queries/Mutations

export const OrganizationsListQuery = createQueryKey("Organizations in dform");

export const OrganizationsQueryKeys = {
  all: () => [OrganizationsListQuery],
};

export const useOrganizationsListQuery = (options) => {
  return useGenericQuery(
    {
      url: `/api/organization`,
      queryKey: OrganizationsQueryKeys.all(),
    },
    {
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
    {
      url: `api/dform-template/${applicationId}/copy`,
      method: "post",
      queryKey: [...ApplicationQueryKeys.all(), ...DFormTemplateCategoryQueryKeys.all()],
    },
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
    {
      url: `api/dform-template`,
      method: "post",
      queryKey: [...ApplicationQueryKeys.all(), ...DFormTemplateCategoryQueryKeys.all()],
    },
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
