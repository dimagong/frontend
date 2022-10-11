import { toast } from "react-toastify";

import { createQueryKey } from "api/createQueryKey";
import { useGenericMutation } from "api/useGenericMutation";
import { useGenericQuery } from "api/useGenericQuery";

import { CategoryId, CategoryName, OrganizationId, OrganizationType } from "./models";

export const CategoryQueryKey = createQueryKey("Category");

export const CategoryQueryKeys = {
  all: () => [CategoryQueryKey],
  byName: (name: CategoryName) => [...CategoryQueryKeys.all(), { name }],
  ByOrganization: (id: OrganizationId, type: OrganizationType) => [...CategoryQueryKeys.all(), { id, type }],
};

export const useCategory = ({ name }: CategoryProps, options: any) => {
  return useGenericQuery(
    {
      url: `api/dform-template/categories`,
      queryKey: CategoryQueryKeys.byName(name),
      params: {
        ...(name ? { search_by_name: name } : {}),
      },
    },
    options
  );
};

export const useCategoriesByOrganization = (
  { organizationId, organizationType }: CategoriesByOrganizationProps,
  options: any
) => {
  return useGenericQuery(
    {
      url: `api/dform-template/categories/by-organization`,
      queryKey: CategoryQueryKeys.ByOrganization(organizationId, organizationType),
      params: {
        organization_type: organizationType,
        organization_id: organizationId,
      },
    },
    { enabled: [organizationId, organizationType].every(Boolean), ...options }
  );
};

export const useCreateApplicationCategory = (options = {}) => {
  return useGenericMutation(
    {
      url: "/api/dform-template/categories",
      method: "post",
      queryKey: CategoryQueryKeys.all(),
    },
    {
      ...options,
      onSuccess: () => {
        toast.success("Category created");
      },
    }
  );
};

export const useDeleteCategory = ({ categoryId }: DeleteCategoryProps, options = {}) => {
  return useGenericMutation(
    {
      url: `/api/dform-template/categories/${categoryId}`,
      method: "delete",
      queryKey: CategoryQueryKeys.all(),
    },
    {
      ...options,
      onSuccess: () => {
        toast.success("Category deleted");
      },
    }
  );
};

export const useUpdateCategory = ({ categoryId }: UpdateCategoryProps, options = {}) => {
  return useGenericMutation(
    {
      url: `/api/dform-template/categories/${categoryId}`,
      method: "put",
      queryKey: CategoryQueryKeys.all(),
    },
    {
      ...options,
      onSuccess: () => {
        toast.success("Category updated");
      },
    }
  );
};

type CategoryProps = {
  name: CategoryName;
};

type CategoriesByOrganizationProps = {
  organizationId: OrganizationId;
  organizationType: OrganizationType;
};

type UpdateCategoryProps = {
  categoryId: CategoryId;
};

type DeleteCategoryProps = {
  categoryId: CategoryId;
};
