import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { stringToBytes } from "@taquito/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function payloadBytesFromString(text: string) {
  const bytes = stringToBytes(text);
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  return "05" + "01" + paddedBytesLength + bytes;
}
