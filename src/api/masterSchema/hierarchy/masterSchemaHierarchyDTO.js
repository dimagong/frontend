import {
  addNodeToRoot,
  MasterSchemaHierarchyRoot,
  MasterSchemaHierarchyGroup,
  MasterSchemaHierarchyField,
} from "./masterSchemaHierarchyModel";

const toNodeId = ({ nodeId }) => nodeId;

const parseHierarchyFields = (rawFields, parent, root) => {
  return rawFields.map((rawField) => {
    const field = MasterSchemaHierarchyField({
      id: rawField.id,
      name: rawField.name,
      parent,
      isSystem: rawField.is_system,
      updatedAt: rawField.updated_at,
      createdAt: rawField.created_at,
      userFiles: rawField.user_files,
      userValue: rawField.user_value,
      memberFirmValue: rawField.member_firm_value,
      userDFormCount: rawField.user_d_form_count,
      userMasterSchemaFieldVersionsCount: rawField.user_master_schema_field_versions_count,
    });

    addNodeToRoot(field, root);

    return field;
  });
};

const parseHierarchyGroups = (rawGroups, parent, root) => {
  return rawGroups.map((rawGroup) => {
    const group = MasterSchemaHierarchyGroup({
      id: rawGroup.id,
      name: rawGroup.name,
      parent,
      isSystem: rawGroup.is_system,
      updatedAt: rawGroup.updated_at,
      createdAt: rawGroup.created_at,
      fields: [],
      groups: [],
      isMemberFirmGroup: rawGroup.is_member_firm_group,
    });

    group.fields = parseHierarchyFields(rawGroup.fields, group, root).map(toNodeId);
    group.groups = parseHierarchyGroups(rawGroup.groups, group, root).map(toNodeId);

    addNodeToRoot(group, root);

    return group;
  });
};

const parseHierarchy = (rawHierarchy) => {
  const root = MasterSchemaHierarchyRoot({
    id: rawHierarchy.id,
    name: rawHierarchy.name,
    updatedAt: rawHierarchy.updated_at,
    createdAt: rawHierarchy.created_at,
    isSystem: rawHierarchy.is_system,
    isMemberFirmGroup: rawHierarchy.is_member_firm_group,
    fields: [],
    groups: [],
  });

  root.fields = parseHierarchyFields(rawHierarchy.fields, root, root).map(toNodeId);
  root.groups = parseHierarchyGroups(rawHierarchy.groups, root, root).map(toNodeId);

  return root;
};

export const MasterSchemaHierarchyDTO = {
  parse: (rawHierarchy) => {
    return rawHierarchy ? parseHierarchy(rawHierarchy) : null;
  },
};
