import _ from "lodash/fp";

let id = 0;

export const getRawNode = ({ id, name, parent_id, is_system = Math.random() > 0.5 }) => ({
  id,
  name,
  parent_id,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  is_system,
});

export const getRawField = (
  id,
  name,
  parent_id,
  {
    is_system,
    parent_group_name = null,
    provided_by_full_name = null,
    application_names = null,
    user_files = null,
    user_value = null,
    member_firm_value = null,
    user_d_form_count = null,
    user_master_schema_field_versions_count = null,
  } = {}
) => ({
  ...getRawNode({ id, name, parent_id, is_system }),
  parent_group_name,
  provided_by_full_name,
  application_names,
  user_files,
  user_value,
  member_firm_value,
  user_d_form_count,
  user_master_schema_field_versions_count,
});

export const getRawGroup = (
  id,
  name,
  parent_id,
  { is_system, is_member_firm_group = false, fields = [], groups = [] } = {}
) => ({
  ...getRawNode({ id, name, parent_id, is_system }),
  fields,
  groups,
  is_member_firm_group,
});

export const getRawHierarchy = (id, name, { master_schema_id, is_member_firm_group, groups = [], fields = [] }) => ({
  ...getRawGroup(id, name, null, {
    fields,
    groups,
    is_system: true,
    is_member_firm_group,
  }),
  master_schema_id,
});

export const buildRawHierarchy = (name = "root", master_schema_id = 1) => {
  return getRawHierarchy(1, name, {
    master_schema_id,
    fields: [getRawField(2, "field1", 1), getRawField(3, "field2", 1)],
    groups: [
      getRawGroup(4, "memberFirm", 1, {
        is_member_firm_group: true,
        fields: [getRawField(5, "memberField1", 4), getRawField(6, "memberField1", 4)],
      }),
      getRawGroup(7, "group1", 1, {
        fields: [getRawField(8, "subField1", 7)],
        groups: [
          getRawGroup(9, "subGroup1", 7, {
            fields: [getRawField(10, "subField2", 9)],
          }),
        ],
      }),
    ],
  });
};

export const getNode = (nodeId, childrenStructure = [], { isMemberFirmGroup } = { isMemberFirmGroup: false }) => ({
  id: id++,
  nodeId,
  name: nodeId,
  childrenStructure,
  groups: childrenStructure.filter(_.get("isContainable")).map(_.get("nodeId")),
  fields: childrenStructure.filter(_.negate(_.get("isContainable"))).map(_.get("nodeId")),
  isContainable: !_.isEmpty(childrenStructure),
  isMemberFirmGroup,
});

export const getHierarchy = (name, masterSchemaId, childrenStructure = []) => {
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

let masterSchemaId = 0;
let organizationId = 0;

export const getRawMasterSchema = ({
  id = masterSchemaId++,
  name = "ms-name",
  organization_id = organizationId++,
} = {}) => ({
  id,
  name,
  organization_id,
  organization_type: "mock_type",
});

export const buildRawMasterSchemas = () => [getRawMasterSchema(), getRawMasterSchema()];
