import { MasterSchemaHierarchyField, MasterSchemaHierarchyRoot } from "./masterSchemaHierarchyModel";

describe("MasterSchema hierarchy models", () => {
  it("should add node to root", () => {
    const root = MasterSchemaHierarchyRoot({
      id: 0,
      name: "cat",
      isSystem: true,
      updatedAt: "",
      createdAt: "",
      fields: [],
      groups: [],
      isMemberFirmGroup: false,
    });

    const field = MasterSchemaHierarchyField({
      id: 1,
      name: "el",
      parent: root,
      isSystem: false,
      updatedAt: "",
      createdAt: "",
      userFiles: [],
      userValue: null,
      memberFirmValue: null,
      userDFormCount: 0,
      userMasterSchemaFieldVersionsCount: 0,
    });

    expect(Object.values(root.nodes).length).toBe(1);
    expect(Object.values(root.children).length).toBe(0);

    MasterSchemaHierarchyRoot.addNode(field, root);

    expect(Object.values(root.nodes).length).toBe(2);
    expect(Object.values(root.children).length).toBe(1);
  });
});
