import _ from "lodash/fp";

let id = 0;

const getNode = (nodeId, childrenStructure = [], { isMemberFirmGroup } = { isMemberFirmGroup: false }) => ({
  id: id++,
  nodeId,
  childrenStructure,
  groups: childrenStructure.filter(_.get("isContainable")).map(_.get("nodeId")),
  fields: childrenStructure.filter(_.negate(_.get("isContainable"))).map(_.get("nodeId")),
  isContainable: !_.isEmpty(childrenStructure),
  isMemberFirmGroup,
});

const getHierarchy = (name, masterSchemaId, childrenStructure = []) => {
  const children = {};
  const root = getNode(name, childrenStructure);

  (function buildChildrenStructure(node) {
    node.childrenStructure.forEach((child) => {
      children[child.nodeId] = child;
      child.isContainable && buildChildrenStructure(child);
      delete child.childrenStructure;
    });
  })(root);
  const nodes = { ...children, root };

  return {
    ...root,
    nodes,
    children,
    masterSchemaId,
  };
};

export const buildHierarchy = (rootName = "root", masterSchemaId = 1) =>
  getHierarchy(rootName, masterSchemaId, [
    getNode("field1"),
    getNode("field2"),
    getNode("memberFirm", [getNode("field8"), getNode("field9")], { isMemberFirmGroup: true }),
    getNode("group1", [getNode("field3"), getNode("field4"), getNode("field5")]),
    getNode("group2", [getNode("field6"), getNode("field7"), getNode("group3", [getNode("field10")])]),
  ]);
