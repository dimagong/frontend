import { rest } from "msw";
import { setupServer } from "msw/node";

import * as Urls from "./constants";
import * as Interfaces from "./interfaces";
import masterSchemaApi from "./masterSchema";
import { buildRawHierarchy, buildRawMasterSchemas, getRawGroup, getRawField } from "./masterSchemaMockUtils";

const flatPromise = async (promise) => {
  const result = [];

  try {
    const data = await promise;
    result.push(data, null);
  } catch (error) {
    result.push(null, error);
  }

  return result;
};

const server = setupServer();

const mockResponse = (url, data) => {
  const fullUrl = new URL(url, process.env.REACT_APP_API_URL).toString();

  return server.use(rest.get(fullUrl, (req, res, ctx) => res(ctx.json({ data }))))
};

describe("masterSchemaApi", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("getAll", async () => {
    const mockMasterSchemas = buildRawMasterSchemas();

    mockResponse(Urls.getMasterSchemaListUrl, mockMasterSchemas);

    const [data] = await flatPromise(masterSchemaApi.getAll());
    const expected = Interfaces.MasterSchemaArrayInterface.validateSync(mockMasterSchemas);

    expect(data).toStrictEqual(expected);
  });

  it("getHierarchy", async () => {
    const masterSchemaId = 1;
    const mockHierarchy = buildRawHierarchy("root", masterSchemaId);

    mockResponse(Urls.getMasterSchemaHierarchyUrl(masterSchemaId), mockHierarchy);

    const [data] = await flatPromise(masterSchemaApi.getHierarchy({ masterSchemaId }));
    const expected = Interfaces.MasterSchemaHierarchyInterface.validateSync(mockHierarchy);

    expect(data).toStrictEqual(expected);
  });

  it("getAllMasterSchemaGroups", async () => {
    const masterSchemaId = 1;
    const mockGroups = [getRawGroup(1, "group1", 0), getRawGroup(2, "group2", 0)];

    mockResponse(Urls.getMasterSchemaGroupsUrl(masterSchemaId), mockGroups);

    const [data] = await flatPromise(masterSchemaApi.getAllMasterSchemaGroups({ masterSchemaId }));
    const expected = Interfaces.MasterSchemaFlatGroupsInterface.validateSync(mockGroups);

    expect(data).toStrictEqual(expected);
  });

  it("getUnapprovedFields", async () => {
    const masterSchemaId = 1;
    const mockFields = [
      getRawField(1, "field1", 0, { application_names: ["someApp"], parent_group_name: "parentDir" }),
    ];

    mockResponse(Urls.getMasterSchemaUnapprovedUrl(masterSchemaId), mockFields);

    const [data] = await flatPromise(masterSchemaApi.getUnapprovedFields({ masterSchemaId }));
    const expected = Interfaces.MasterSchemaUnapprovedFieldsInterface.validateSync(mockFields);

    expect(data).toStrictEqual(expected);
  });
});
