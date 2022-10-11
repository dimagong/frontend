import { toast } from "react-toastify";
import { QueryOptions } from "react-query";

import { createQueryKey } from "api/createQueryKey";
import { useGenericMutation } from "api/useGenericMutation";
import { useGenericQuery } from "api/useGenericQuery";

import { CategoryId, CategoryName, OrganizationId, OrganizationType } from "./models";

export const CategoryQueryKey = createQueryKey("Category");

export const CategoryQueryKeys = {
  all: () => [CategoryQueryKey],
  byName: (name: CategoryName) => [...CategoryQueryKeys.all(), { name }],
  byOrganization: (id: OrganizationId, type: OrganizationType) => [...CategoryQueryKeys.all(), { id, type }],
};

export const useCategory = ({ name, ...options }: CategoryProps) => {
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

export const useCategoriesByOrganization = ({
  organizationId,
  organizationType,
  ...options
}: CategoriesByOrganizationProps) => {
  return useGenericQuery(
    {
      url: `api/dform-template/categories/by-organization`,
      queryKey: CategoryQueryKeys.byOrganization(organizationId, organizationType),
      params: {
        organization_type: organizationType,
        organization_id: organizationId,
      },
    },
    { enabled: [organizationId, organizationType].every(Boolean), ...options }
  );
};

export const useCreateApplicationCategory = (options: QueryOptions) => {
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

export const useDeleteCategory = ({ categoryId, ...options }: DeleteCategoryProps) => {
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

export const useUpdateCategory = ({ categoryId, ...options }: UpdateCategoryProps) => {
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

type CategoryProps = QueryOptions & {
  name: CategoryName;
};

type CategoriesByOrganizationProps = QueryOptions & {
  organizationId: OrganizationId;
  organizationType: OrganizationType;
};

type UpdateCategoryProps = QueryOptions & {
  categoryId: CategoryId;
};

type DeleteCategoryProps = QueryOptions & {
  categoryId: CategoryId;
};
