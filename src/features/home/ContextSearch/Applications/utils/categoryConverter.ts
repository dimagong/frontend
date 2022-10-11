import { CategoryHierarchy, CategoryForSelect } from "../models";

export const parseHierarchyCategory = (category: any): CategoryHierarchy => {
  return {
    dformTemplateId: category.dform_template_id,
    dformTemplateName: category.dform_template_name,
    categoryId: category.category_id,
    categoryParent: category.category_parent,
    categoryName: category.category_name,
    categoryOrganizationId: category.category_organization_id,
    categoryOrganizationType: category.category_organization_type,
    categoryCreatedAt: category.category_created_at,
    categoryUpdatedAt: category.category_updated_at,
    dformTemplateDescription: category.dform_template_description,
    dformTemplateIsPrivate: category.dform_template_is_private,
    dformTemplateCreated_at: category.dform_template_created_at,
    dformTemplateUpdated_at: category.dform_template_updated_at,
    rootCategoryId: category.root_category_id,
    breadcrumbs: category.breadcrumbs,
    dformTemplateOrganizationId: category.dform_template_organization_id,
    dformTemplateOrganizationType: category.dform_template_organization_type,
  };
};

export const parseSelectCategory = (category: any): CategoryForSelect => {
  return {
    breadcrumbs: category.breadcrumbs,
    createdAt: category.category_created_at,
    updatedAt: category.category_updated_at,
    name: category.category_name,
    id: category.category_id,
    parent: category.category_parent,
    rootCategoryId: category.root_category_id,
  };
};
