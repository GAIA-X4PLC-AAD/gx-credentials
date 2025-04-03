import { stringToBytes } from "@taquito/utils";

export function generateChallenge(): string {
  //TODO: url should ideally come from env
  const dappUrl = "gx-credentials.example.com";
  const ISO8601formatedTimestamp = new Date().toISOString();
  const input = "GX Credentials Login";
  const formattedInput: string = [
    "Tezos Signed Message:",
    dappUrl,
    ISO8601formatedTimestamp,
    input,
  ].join(" ");
  return formattedInput;
}

export function payloadBytesFromString(text: string): string {
  const bytes = stringToBytes(text);
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  return "05" + "01" + paddedBytesLength + bytes;
}
