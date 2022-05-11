const getPath = (name, initialParent) => {
  const path = [name];

  let currentParent = initialParent;
  while (currentParent) {
    path.unshift(currentParent.name);
    currentParent = currentParent.parent;
  }

  return path;
};

const getNodeId = (nodeName, id) => `${nodeName}${id}`;

export const MasterSchemaHierarchyNode = (spec) => {
  const { id, name, parent, nodeName, isSystem, updatedAt, createdAt, isContainable } = spec;

  return {
    id,
    name,
    path: getPath(name, parent),
    nodeId: getNodeId(nodeName, id),
    parentId: parent ? parent.id : null,
    parentNodeId: spec.parent ? spec.parent.nodeId : null,
    nodeName,
    isSystem,
    updatedAt,
    createdAt,
    isContainable,
  };
};

export const MasterSchemaHierarchyField = (spec) => {
  const {
    id,
    name,
    parent,
    isSystem,
    updatedAt,
    createdAt,
    nodeName = "field",
    userFiles,
    userValue,
    memberFirmValue,
    userDFormCount,
    userMasterSchemaFieldVersionsCount,
  } = spec;

  return {
    ...MasterSchemaHierarchyNode({
      id,
      name,
      parent,
      isSystem,
      updatedAt,
      createdAt,
      nodeName,
      isContainable: false,
    }),

    userFiles,
    userValue,
    memberFirmValue,
    userDFormCount,
    userMasterSchemaFieldVersionsCount,

    isMemberFirmField: parent.isMemberFirmGroup,
  };
};

export const MasterSchemaHierarchyGroup = (spec) => {
  const { id, name, parent, isSystem, updatedAt, createdAt, nodeName = "group", fields, groups, isMemberFirmGroup } = spec;

  return {
    ...MasterSchemaHierarchyNode({
      id,
      name,
      parent,
      isSystem,
      updatedAt,
      createdAt,
      nodeName,
      isContainable: true,
    }),

    fields,
    groups,
    isMemberFirmGroup,
  };
};

export const MasterSchemaHierarchyRoot = (spec) => {
  const { id, name, isSystem, updatedAt, createdAt, fields, groups, isMemberFirmGroup } = spec;

  return {
    ...MasterSchemaHierarchyGroup({
      id,
      name,
      parent: null,
      isSystem,
      updatedAt,
      createdAt,
      fields,
      groups,
      isMemberFirmGroup,
      nodeName: "root",
      isContainable: true,
    }),

    children: {},
  };
};

export const addNodeToRoot = (node, root) => {
  root.children[node.nodeId] = node;
};
