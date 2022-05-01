import { buildRawHierarchy } from "./masterSchemaMockUtils";
import { MasterSchemaHierarchyInterface } from "./interfaces";
import { normalizeHierarchy, normalizeNode, normalizeFields, normalizeGroups } from "./normalizers";

describe("normalizers", () => {
  it("normalizeNode", () => {
    const hierarchy = MasterSchemaHierarchyInterface.cast(buildRawHierarchy());
    const field = hierarchy.fields[0];
    const group = hierarchy.groups[1];

    const normalizedField = normalizeNode(field, { isContainable: false });

    expect(normalizedField.nodeId).toBe(`field${field.id}`);
    expect(normalizedField.parentNodeId).toBe(null);
    expect(normalizedField.path).toStrictEqual([field.name]);

    const children = {};
    const normalizedGroup = normalizeNode(group, { isContainable: true, children });

    expect(normalizedGroup.nodeId).toBe(`group${group.id}`);
    expect(normalizedGroup.parentNodeId).toBe(null);
    expect(normalizedGroup.path).toStrictEqual([group.name]);

    const { fields, groups } = normalizedGroup;
    expect(fields).toStrictEqual(group.fields.map(({ id }) => `field${id}`));
    expect(groups).toStrictEqual(group.groups.map(({ id }) => `group${id}`));

    expect(children[groups[0]].parentId).toBe(normalizedGroup.id);
    expect(children[fields[0]].parentId).toBe(normalizedGroup.id);
  });

  it("normalizeHierarchy", () => {
    const hierarchy = MasterSchemaHierarchyInterface.cast(buildRawHierarchy());
    const field = hierarchy.fields[0];
    const group = hierarchy.groups[0];

    const normalized = normalizeHierarchy(hierarchy);
    const memberFirmGroup = normalized.children["group4"]; //?
    const memberFirmField1 = normalized.children["field5"]; //?
    const memberFirmField2 = normalized.children["field6"]; //?

    expect(memberFirmGroup.isMemberFirmGroup).toBe(true);
    expect(memberFirmField1.isMemberFirmField).toBe(true);
    expect(memberFirmField2.isMemberFirmField).toBe(true);

    expect(normalized.nodes[`field${field.id}`].id).toBe(field.id);
    expect(normalized.nodes[`group${group.id}`].id).toBe(group.id);
    expect(normalized.nodes[`group${normalized.id}`].id).toBe(normalized.id);

    expect(normalized.children[`field${field.id}`].id).toBe(field.id);
    expect(normalized.children[`group${group.id}`].id).toBe(group.id);

    expect(hierarchy.masterSchemaId).toBe(normalized.masterSchemaId);
  });

  it("normalizeFields", () => {
    const hierarchy = MasterSchemaHierarchyInterface.cast(buildRawHierarchy());

    const normalizedFields = normalizeFields(hierarchy.fields);

    expect(normalizedFields[0]).toStrictEqual(normalizeNode(hierarchy.fields[0], { isContainable: false }));
    expect(normalizedFields[1]).toStrictEqual(normalizeNode(hierarchy.fields[1], { isContainable: false }));
  });

  it("normalizeGroups", () => {
    const hierarchy = MasterSchemaHierarchyInterface.cast(buildRawHierarchy());

    const normalizedGroups = normalizeGroups(hierarchy.groups);

    expect(normalizedGroups[0]).toStrictEqual(normalizeNode(hierarchy.groups[0], { isContainable: true }));
    expect(normalizedGroups[1]).toStrictEqual(normalizeNode(hierarchy.groups[1], { isContainable: true }));
  });
});
