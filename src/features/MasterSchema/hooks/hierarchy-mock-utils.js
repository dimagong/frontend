import _ from "lodash/fp";

let id = 0;

const getNode = (nodeId, children = [], { isMemberFirmGroup } = { isMemberFirmGroup: false }) => ({
  id: id++,
  nodeId,
  children,
  groups: children.filter(_.get("isContainable")).map(_.get("nodeId")),
  fields: children.filter(_.negate(_.get("isContainable"))).map(_.get("nodeId")),
  isContainable: children.length > 0,
  isMemberFirmGroup,
});

const getDescendants = (node) => {
  return [node, ...node.children.map((child) => (child.isContainable > 0 ? getDescendants(child) : child)).flat()];
};

const getHierarchy = (name, masterSchemaId, children = []) => {
  const root = { ...getNode(name, children) };
  const nodeMap = new Map(getDescendants(root).map((child) => [child.nodeId, child]));

  return {
    ...root,
    nodeMap,
    masterSchemaId,
  };
};

export const buildHierarchy = () =>
  getHierarchy("root", 1, [
    getNode("field1"),
    getNode("field2"),
    getNode("memberFirm", [getNode("field8"), getNode("field9")], { isMemberFirmGroup: true }),
    getNode("group1", [getNode("field3"), getNode("field4"), getNode("field5")]),
    getNode("group2", [getNode("field6"), getNode("field7"), getNode("group3", [getNode("field10")])]),
  ]);
