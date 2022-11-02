import { compareByName } from "utility/compareByName";

import { parseHierarchyCategory } from "./categoryConverter";

import { CategoryHierarchy, CategoryId, Field, Group, Hierarchy, Node } from "../models";

export const getNodeId = (nodeName: string, id: number) => `${nodeName}${id}`;

export const makeGroup = (category: CategoryHierarchy, fields: Field[]): Group => {
  const containedFields = fields.filter((field) => field.categoryId === category.categoryId).sort(compareByName);

  const groupsNodeIds = containedFields.map((containedField) => containedField.nodeId);

  return {
    id: category.categoryId,
    isContainable: true,
    name: category.categoryName!,
    nodeId: getNodeId("group", category.categoryId!),
    parentId: category.categoryParent,
    parentNodeId: `group${category.categoryParent}`,
    rootCategoryId: category.rootCategoryId,
    organizationId: category.categoryOrganizationId,
    organizationType: category.categoryOrganizationType,
    fields: groupsNodeIds,
    groups: [],
    isSystem: false,
    createdAt: category.categoryCreatedAt,
    breadcrumbs: category.breadcrumbs,
    path: category.breadcrumbs.split("."),
  };
};

export const makeField = (category: CategoryHierarchy): Field => {
  return {
    id: category.dformTemplateId,
    isContainable: false,
    name: category.dformTemplateName,
    nodeId: getNodeId("field", category.dformTemplateId!),
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    parentNodeId: `group${category.categoryParent}`,
    rootCategoryId: category.rootCategoryId,
    isSystem: false,
    createdAt: category.dformTemplateCreated_at,
    userValue: null,
    breadcrumbs: category.breadcrumbs,
    path: category.breadcrumbs.split("."),
  };
};

export const updateGroupsField = (groups: Group[]): Group[] => {
  groups.map((group) => {
    if (group.parentId === null) {
      return group;
    }

    const groupIndex = groups.findIndex((groupOwner) => groupOwner.id === group.parentId);

    if (groupIndex === -1) {
      return group;
    }

    return groups[groupIndex].groups.push(group.nodeId);
  });

  return groups;
};

export const transformCategoriesToHierarchy = (data: any[]): Hierarchy[] => {
  let categories: CategoryHierarchy[] = [];
  const applications: CategoryHierarchy[] = [];

  let fields: Field[] = [];
  let groups: Group[] = [];

  // Distribution into categories and applications
  data.forEach((category) => {
    category = parseHierarchyCategory(category);

    if (category.dformTemplateId === null) {
      categories.push(category);
    } else {
      applications.push(category);
    }
  });

  categories = fillUnusedCategories(applications, categories);

  applications.forEach((application) => {
    fields.push(makeField(application));
  });

  categories.forEach((category) => {
    groups.push(makeGroup(category, fields));
  });

  groups.sort(compareByName);
  fields.sort(compareByName);

  groups = updateGroupsField(groups);

  return getHierarchies(groups, fields);
};

const getContainedById = (array: Node[], id: CategoryId): Node[] => {
  return array.filter((arrayItem) => Number(arrayItem.rootCategoryId) === id);
};

const makeObjectWithNodeIdFields = (array: Node[]) => {
  const ObjectWithNodeIdFields = {};

  // console.log("array", array);

  array.forEach((arrayItem) => {
    ObjectWithNodeIdFields[arrayItem.nodeId!] = arrayItem;
  });

  return ObjectWithNodeIdFields;
};

const getHierarchies = (groups: Group[], fields: Field[]): Hierarchy[] => {
  const hierarchies: Hierarchy[] = [];

  const groupsWithOutRoots = groups.filter((group) => group.parentId !== null);

  const rootGroups = groups.filter((group) => group.parentId === null);

  rootGroups.forEach((rootGroup) => {
    hierarchies.push(makeHierarchy(rootGroup, fields, groupsWithOutRoots));
  });

  return hierarchies;
};

export const makeHierarchy = (rootGroup: Group, fields: Field[], groupsWithOutRoots: Group[]): Hierarchy => {
  const containedFields = getContainedById(fields, rootGroup.id!);
  const containedAllGroups = getContainedById(groupsWithOutRoots, rootGroup.id!);

  const containedFieldsObject = makeObjectWithNodeIdFields(containedFields);
  const containedAllGroupsObject = makeObjectWithNodeIdFields(containedAllGroups);
  const rootCategoryObject = {};

  rootCategoryObject[rootGroup.nodeId!] = rootGroup;

  const children = { ...containedFieldsObject, ...containedAllGroupsObject };

  return {
    id: rootGroup.id,
    isContainable: true,
    children: children,
    nodes: { ...children, ...rootCategoryObject },
    fields: rootGroup.fields,
    groups: rootGroup.groups,
    name: rootGroup.name,
    nodeId: `group${rootGroup.id}`,
    parentId: null,
    parentNodeId: null,
    isSystem: true,
    organizationId: rootGroup.organizationId,
    organizationType: rootGroup.organizationType,
    breadcrumbs: rootGroup.breadcrumbs,
    path: rootGroup.breadcrumbs.split("."),
    createdAt: rootGroup.createdAt,
    rootCategoryId: rootGroup.rootCategoryId!,
  };
};

const fillUnusedCategories = (
  applications: CategoryHierarchy[],
  categories: CategoryHierarchy[]
): CategoryHierarchy[] => {
  applications.forEach((application) => {
    const indexExistCategory = categories.findIndex((category) => category.categoryId === application.categoryId);

    if (indexExistCategory === -1) {
      categories.push(application);
    }
  });

  return categories;
};
