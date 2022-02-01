import _ from "lodash/fp";

let id = 0;

const getRawNode = ({ id, name, parent_id, is_system = Math.random() > 0.5 }) => ({
  id,
  name,
  parent_id,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  is_system,
});

const getRawField = (
  id,
  name,
  parent_id,
  { is_system, user_files, user_value, member_firm_value, user_d_form_count, user_master_schema_field_versions_count } = {}
) => ({
  ...getRawNode({ id, name, parent_id, is_system }),
  user_files,
  user_value,
  member_firm_value,
  user_d_form_count,
  user_master_schema_field_versions_count,
});

const getRawGroup = (id, name, parent_id, { is_system, fields = [], groups = [] }) => ({
  ...getRawNode({ id, name, parent_id, is_system }),
  fields,
  groups,
  is_member_firm_group: Math.random() > 0.5,
});

const getRawHierarchy = (id, name, { master_schema_id, groups = [], fields = [] }) => ({
  ...getRawGroup(id, name, null, {
    is_system: true,
    fields,
    groups,
  }),
  master_schema_id,
});

export const buildRawHierarchy = (name = "root", master_schema_id = 1) => {
  return getRawHierarchy(1, name, {
    master_schema_id,
    fields: [getRawField(2, "field1", 1), getRawField(3, "field2", 1)],
    groups: [
      getRawGroup(4, "memberFirm", 1, {
        fields: [getRawField(5, "memberField1", 4), getRawField(6, "memberField1", 4)],
      }),
      getRawGroup(7, "group1", 1, {
        fields: [getRawField(8, "subField1", 7)],
        groups: [getRawGroup(9, "subGroup1", 7, {
          fields: [getRawField(10, "subField2", 9)],
        })],
      }),
    ],
  });
};

const getNode = (nodeId, childrenStructure = [], { isMemberFirmGroup } = { isMemberFirmGroup: false }) => ({
  id: id++,
  nodeId,
  name: nodeId,
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
