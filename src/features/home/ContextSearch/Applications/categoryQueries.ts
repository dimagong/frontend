import { toast } from "react-toastify";
import { QueryOptions } from "react-query";

import { createQueryKey } from "api/createQueryKey";
import { useGenericMutation } from "api/useGenericMutation";
import { useGenericQuery } from "api/useGenericQuery";

import { CategoryId, CategoryName, OrganizationId, OrganizationType } from "./models";

export const DFormTemplateCategoryQueryKey = createQueryKey("DFormTemplateCategory");

export const DFormTemplateCategoryQueryKeys = {
  all: () => [DFormTemplateCategoryQueryKey],
  byNameAndRootCategory: (name: CategoryName, rootCategoryId: CategoryId) => [
    ...DFormTemplateCategoryQueryKeys.all(),
    { name, rootCategoryId },
  ],
  byOrganization: (id: OrganizationId, type: OrganizationType) => [
    ...DFormTemplateCategoryQueryKeys.all(),
    { id, type },
  ],
};

export const useDFormTemplateCategoryQuery = ({
  name,
  rootCategoryId,
  ...options
}: DFormTemplateCategoryQueryProps) => {
  return useGenericQuery(
    {
      url: `api/dform-template/categories`,
      queryKey: DFormTemplateCategoryQueryKeys.byNameAndRootCategory(name, rootCategoryId),
      params: {
        ...(name ? { search_by_name: name } : {}),
        root_category_id: rootCategoryId,
      },
    },
    options
  );
};

export const useDFormTemplateRootCategoriesQuery = (options?: QueryOptions) => {
  return useGenericQuery(
    {
      url: `api/dform-template/categories/root`,
      queryKey: DFormTemplateCategoryQueryKeys.all(),
    },
    options
  );
};

export const useDFormTemplateCategoriesQuery = ({
  organizationId,
  organizationType,
  ...options
}: DFormTemplateCategoriesQueryProps) => {
  return useGenericQuery(
    {
      url: `api/dform-template/categories/by-organization`,
      queryKey: DFormTemplateCategoryQueryKeys.byOrganization(organizationId, organizationType),
      params: {
        organization_type: organizationType,
        organization_id: organizationId,
      },
    },
    { enabled: [organizationId, organizationType].every(Boolean), ...options }
  );
};

export const useCreateDFormTemplateCategoryMutation = (options: QueryOptions) => {
  return useGenericMutation(
    {
      url: "/api/dform-template/categories",
      method: "post",
      queryKey: DFormTemplateCategoryQueryKeys.all(),
    },
    {
      ...options,
      onSuccess: () => {
        toast.success("Category created");
      },
    }
  );
};

export const useDeleteDFormTemplateCategoryMutation = ({
  categoryId,
  ...options
}: DeleteDFormTemplateCategoryMutationProps) => {
  return useGenericMutation(
    {
      url: `/api/dform-template/categories/${categoryId}`,
      method: "delete",
      queryKey: DFormTemplateCategoryQueryKeys.all(),
    },
    {
      ...options,
      onSuccess: () => {
        toast.success("Category deleted");
      },
    }
  );
};

export const useUpdateDFormTemplateCategoryMutation = ({
  categoryId,
  ...options
}: UpdateDFormTemplateCategoryMutationProps) => {
  return useGenericMutation(
    {
      url: `/api/dform-template/categories/${categoryId}`,
      method: "put",
      queryKey: DFormTemplateCategoryQueryKeys.all(),
    },
    {
      ...options,
      onSuccess: () => {
        toast.success("Category updated");
      },
    }
  );
};

type DFormTemplateCategoryQueryProps = QueryOptions & {
  name: CategoryName;
  rootCategoryId: CategoryId;
};

type DFormTemplateCategoriesQueryProps = QueryOptions & {
  organizationId: OrganizationId;
  organizationType: OrganizationType;
};

type UpdateDFormTemplateCategoryMutationProps = QueryOptions & {
  categoryId: CategoryId;
};

type DeleteDFormTemplateCategoryMutationProps = QueryOptions & {
  categoryId: CategoryId;
};
