import { validateAddress, verifySignature, getPkhfromPk } from "@taquito/utils";
import { payloadBytesFromString } from "../../../lib/payload";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

jest.mock("@taquito/utils", () => ({
  validateAddress: jest.fn(),
  verifySignature: jest.fn(),
  getPkhfromPk: jest.fn(),
}));

jest.mock("../../../lib/payload", () => ({
  payloadBytesFromString: jest.fn(),
}));

describe("NextAuth configuration", () => {
  let credsProvider;

  beforeEach(() => {
    credsProvider = authOptions.providers[0];
  });

  it("returns null when address is invalid", async () => {
    validateAddress.mockReturnValue(1);
    const result = await credsProvider.authorize({ pkh: "invalid" });
    expect(result).toBeNull();
  });

  it("returns null when signature is invalid", async () => {
    validateAddress.mockReturnValue(3);
    verifySignature.mockReturnValue(false);
    const result = await credsProvider.authorize({
      pkh: "valid",
      pk: "valid",
      formattedInput: "input",
      signature: "invalid",
    });
    expect(result).toBeNull();
  });

  it("returns user object when credentials are valid", async () => {
    validateAddress.mockReturnValue(3);
    verifySignature.mockReturnValue(true);
    getPkhfromPk.mockReturnValue("valid");
    payloadBytesFromString.mockReturnValue("challenge");
    const result = await credsProvider.authorize({
      pkh: "valid",
      pk: "valid",
      formattedInput: "challenge",
      signature: "valid",
    });
    expect(result).toEqual({ id: "valid", pkh: "valid" });
  });
});
