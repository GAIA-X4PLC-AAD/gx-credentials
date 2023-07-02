import { rest } from "msw";
import { setupServer } from "msw/node";
import handler from "@/pages/api/publishCredential";

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
  addCredentialInDb: jest.fn(),
  setAddressRoleInDb: jest.fn(),
  updateApplicationStatusInDb: jest.fn(),
}));

describe("Trusted Issuer Credential handler tests", () => {
  test("Should return 401 when not authenticated", async () => {
    require("next-auth/next").getServerSession.mockResolvedValueOnce(null);

    const req = {
      method: "POST",
      body: {
        credential: "test",
        role: "company",
        applicationKey: "test",
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

  test("Should return 200 when all operations succeed", async () => {
    require("next-auth/next").getServerSession.mockResolvedValueOnce({
      user: { pkh: "test" },
    });
    require("../../lib/database").addCredentialInDb.mockResolvedValueOnce(true);
    require("../../lib/database").setAddressRoleInDb.mockResolvedValueOnce(
      true,
    );
    require("../../lib/database").updateApplicationStatusInDb.mockResolvedValueOnce(
      true,
    );

    const req = {
      method: "POST",
      body: {
        credential: "test",
        role: "company",
        applicationKey: "test",
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

  test("Should return 500 when any operation fails", async () => {
    require("next-auth/next").getServerSession.mockResolvedValueOnce({
      user: { pkh: "test" },
    });
    require("../../lib/database").addCredentialInDb.mockResolvedValueOnce(
      false,
    );

    const req = {
      method: "POST",
      body: {
        credential: "test",
        role: "company",
        applicationKey: "test",
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
