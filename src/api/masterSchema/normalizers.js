import _ from "lodash/fp";

export const normalizeNode = (node, { isContainable, parent = null, children = {} }) => {
  const serialised = {
    ...node,
    nodeId: `${isContainable ? "group" : "field"}${node.id}`,
    parentNodeId: parent ? parent.nodeId : null,
    path: parent ? [...parent.path, node.name] : [node.name],
    isContainable,
  };

  if (node.fields) {
    serialised.fields = [];

    node.fields.forEach((field) => {
      const serialisedField = normalizeNode(field, { isContainable: false, parent: serialised, children });

      serialised.fields.push(serialisedField.nodeId);
      children[serialisedField.nodeId] = serialisedField;
    });
  }

  if (node.groups) {
    serialised.groups = [];

    node.groups.forEach((group) => {
      const serialisedGroup = normalizeNode(group, { isContainable: true, parent: serialised, children });

      serialised.groups.push(serialisedGroup.nodeId);
      children[serialisedGroup.nodeId] = serialisedGroup;
    });
  }

  return serialised;
};

export const normalizeHierarchy = (rawHierarchy) => {
  const children = {};
  const root = normalizeNode(rawHierarchy, { isContainable: true, children });
  const nodes = _.cloneDeep(children);

  nodes[root.nodeId] = root;

  return {
    ...root,
    children,
    nodes,
  };
};

export const normalizeUnapproved = (unapproved) =>
  unapproved.map((field) => normalizeNode(field, { isContainable: false }));

export const normalizeGroups = (groups) =>
  groups.map((group) => {
    const RISKY_CLIENT_LOGIC = { groups: [], fields: [] };
    const normalized = normalizeNode({ ...group, ...RISKY_CLIENT_LOGIC }, { isContainable: true });

    return { label: normalized.name, value: normalized };
  });