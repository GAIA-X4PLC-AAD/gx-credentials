import { rest } from "msw";
import { setupServer } from "msw/node";
import handler from "../../pages/api/takeoutCredential";
import multer from "multer";

// Setup msw and start it
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock("multer", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    fields: jest.fn().mockImplementation((fields) => {
      return (req, res, callback) => {
        req.body = {
          subject_id: "test",
          presentation: JSON.stringify({}),
        };
        callback(null);
      };
    }),
  }),
}));

jest.mock("../../lib/verifyPresentation", () => ({
  verifyIdentificationPresentation: jest.fn(),
}));

jest.mock("../../lib/database", () => ({
  getCredentialsFromDb: jest.fn(),
}));

describe("Credential Offer API handler tests", () => {
  test("Should handle GET request", async () => {
    const req = { method: "GET" };
    const res = { status: jest.fn(() => res), json: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should handle POST request", async () => {
    require("../../lib/verifyPresentation").verifyIdentificationPresentation.mockResolvedValueOnce(
      true,
    );
    require("../../lib/database").getCredentialsFromDb.mockResolvedValueOnce([
      { credential: {} },
    ]);

    const req = { method: "POST", body: { presentation: "{}" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      end: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("Should handle error during POST request", async () => {
    require("../../lib/verifyPresentation").verifyIdentificationPresentation.mockResolvedValueOnce(
      false,
    );

    const req = { method: "POST", body: { presentation: "{}" } };
    const res = {
      status: jest.fn(() => res),
      end: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.end).toHaveBeenCalled();
  });

  test("Should handle unhandled method", async () => {
    const req = { method: "PUT" };
    const res = { status: jest.fn(() => res), end: jest.fn() };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.end).toHaveBeenCalled();
  });

  test("Should handle error during execution", async () => {
    const req = { method: "GET" };
    const res = { status: jest.fn(() => res), end: jest.fn() };

    res.status.mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.end).toHaveBeenCalled();
  });
});
