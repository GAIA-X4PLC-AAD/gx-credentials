import { rest } from "msw";
import { setupServer } from "msw/node";
import handler from "../../pages/api/applyAsCompany";

// Setup msw and start it
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock("next-auth/next", () => ({
  __esModule: true,
  default: jest.fn(),
  getServerSession: jest.fn(),
}));

jest.mock("../../lib/database", () => ({
  setAddressRoleInDb: jest.fn(),
  writeApplicationToDb: jest.fn(),
}));

describe("handler tests", () => {
  test("Should return 401 when not authenticated", async () => {
    require("next-auth/next").getServerSession.mockResolvedValueOnce(null);

    const req = {
      method: "POST",
      body: {
        name: "test",
        gx_id: "test",
        description: "test",
      },
    };
    const res = {
      status: jest.fn(() => res),
      end: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalled();
  });

  test("Should return 200 when application write succeeds", async () => {
    require("next-auth/next").getServerSession.mockResolvedValueOnce({
      user: { pkh: "test" },
    });
    require("../../lib/database").writeApplicationToDb.mockResolvedValueOnce(
      true,
    );
    require("../../lib/database").setAddressRoleInDb.mockResolvedValueOnce(
      true,
    );

    const req = {
      method: "POST",
      body: {
        name: "test",
        gx_id: "test",
        description: "test",
      },
    };
    const res = {
      status: jest.fn(() => res),
      end: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  test("Should return 500 when application write fails", async () => {
    require("next-auth/next").getServerSession.mockResolvedValueOnce({
      user: { pkh: "test" },
    });
    require("../../lib/database").writeApplicationToDb.mockResolvedValueOnce(
      false,
    );

    const req = {
      method: "POST",
      body: {
        name: "test",
        gx_id: "test",
        description: "test",
      },
    };
    const res = {
      status: jest.fn(() => res),
      end: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.end).toHaveBeenCalled();
  });
});
