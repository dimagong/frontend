import * as Model from "./masterSchemaHierarchyModel";
import { buildRawHierarchy } from "./masterSChemaHierarchyMocks";
import { MasterSchemaHierarchyDTO } from "./masterSchemaHierarchyDTO";

const RootModelMock = jest.spyOn(Model, "MasterSchemaHierarchyRoot").mockReturnValue({});
const GroupModelMock = jest.spyOn(Model, "MasterSchemaHierarchyGroup").mockReturnValue({});
const FieldModelMock = jest.spyOn(Model, "MasterSchemaHierarchyField").mockReturnValue({});
const AddNodeToRootMock = jest.spyOn(Model, "addNodeToRoot").mockReturnValue({});

describe("MasterSchema hierarchy DTO", () => {
  beforeEach(() => {
    RootModelMock.mockClear();
    GroupModelMock.mockClear();
    FieldModelMock.mockClear();
    AddNodeToRootMock.mockClear();
  });

  it("should not parse null", () => {
    expect(MasterSchemaHierarchyDTO.parse(null)).toBe(null);
  });

  // ToDo: Think is it good test
  it("should parse the raw hierarchy from API", () => {
    const raw = buildRawHierarchy();

    MasterSchemaHierarchyDTO.parse(raw);

    expect(RootModelMock).toHaveBeenCalledTimes(1);
    expect(FieldModelMock).toHaveBeenCalledTimes(6);
    expect(GroupModelMock).toHaveBeenCalledTimes(3);
    expect(AddNodeToRootMock).toHaveBeenCalledTimes(9);
  });

  it.todo("should have 'children' which has to have all decedents");

  it.todo("should have 'nodes' which has to have all children and itself");
});
