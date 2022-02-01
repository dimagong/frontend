import { rest } from "msw";
import { setupServer } from "msw/node";
import { ValidationError } from "yup";

import * as Urls from "./constants";
import masterSchemaApi from "./masterSchema";

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

describe("masterSchemaApi", () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("getAll", () => {
    it("casting values", async () => {
      server.use(
        rest.get(Urls.getMasterSchemaListUrl, (req, res, ctx) => {
          return res(ctx.json({ data: [{ id: "0", name: ".", organization_id: "0", organization_type: "." }] }));
        })
      );

      const [data] = await flatPromise(masterSchemaApi.getAll());
      expect(data).toStrictEqual([{ id: 0, name: ".", organizationId: 0, organizationType: "." }]);
    });

    it("flatting error", async () => {
      server.use(
        rest.get(Urls.getMasterSchemaListUrl, (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: "Internal Server Error." }));
        })
      );

      const [, error] = await flatPromise(masterSchemaApi.getAll());
      expect(error).toBe("Internal Server Error.");
    });

    it("throwing validation error", async () => {
      server.use(
        rest.get(Urls.getMasterSchemaListUrl, (req, res, ctx) => {
          return res(ctx.json({ data: [{ id: 0 }] }));
        })
      );

      const [,error] = await flatPromise(masterSchemaApi.getAll());
      expect(error).toBeInstanceOf(ValidationError);
    });
  });
});
