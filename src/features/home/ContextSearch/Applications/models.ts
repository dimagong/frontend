export type Field = {
  id: ApplicationId | null;
  isContainable: isContainable;
  name: ApplicationName | null;
  nodeId: string | null;
  categoryId: number | null;
  categoryName: string | null;
  parentNodeId: string | null;
  breadcrumbs: string;
  rootCategoryId: string | null;
  isSystem: boolean;
  createdAt: string | null;
  userValue: null;
  path: string[];
};

export type Group = {
  id: number | null;
  isContainable: isContainable;
  name: CategoryName;
  nodeId: string | null;
  parentId: number | null;
  parentNodeId: string | null;
  organizationId: string | null;
  organizationType: string | null;
  rootCategoryId: string | null;
  breadcrumbs: string;
  fields: (string | null)[];
  groups: (string | null)[];
  isSystem: boolean;
  createdAt: string | null;
  path: string[];
};

export type Hierarchy = {
  breadcrumbs: string;
  children: {
    [key: string]: Field | Group;
  };
  nodes: {
    [key: string]: Field | Group;
  };
  fields: (string | null)[];
  groups: (string | null)[];
  id: number | null;
  isContainable: isContainable;
  name: string | null;
  nodeId: string | null;
  parentId: number | null;
  parentNodeId: string | null;
  organizationId: string | null;
  organizationType: string | null;
  rootCategoryId: RootCategoryId;
  isSystem: boolean;
  createdAt: string | null;
  path: string[];
};

export type CategoryHierarchy = {
  dformTemplateId: number | null;
  dformTemplateName: string | null;
  categoryId: number;
  categoryParent: number | null;
  categoryName: CategoryName | null;
  categoryOrganizationId: OrganizationId | null;
  categoryOrganizationType: OrganizationType | null;
  categoryCreatedAt: string | null;
  categoryUpdatedAt: string | null;
  dformTemplateDescription: string | null;
  dformTemplateIsPrivate: boolean | null;
  dformTemplateCreated_at: string | null;
  dformTemplateUpdated_at: string | null;
  rootCategoryId: RootCategoryId;
  breadcrumbs: string;
  dformTemplateOrganizationId: number | null;
  dformTemplateOrganizationType: string | null;
};

export type CategoryForSelect = {
  breadcrumbs: string;
  createdAt: string | null;
  updatedAt: string | null;
  name: CategoryName | null;
  id: CategoryId;
  parent: CategoryId | null;
  rootCategoryId: RootCategoryId;
};

export type CategoryName = string;
export type ApplicationName = string;

export type CategoryId = number;
export type ApplicationId = number;
export type RootCategoryId = string;

export type OrganizationId = string;
export type OrganizationType = "network" | "corporation";

export type isContainable = boolean;

export type Search = string;

export type CreateCategorySubmitProps = {
  type: symbol;
  name: string;
  parentId: number;
};
