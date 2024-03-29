/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { char2Bytes } from "@taquito/utils";

export function payloadBytesFromString(text: string) {
  const bytes = char2Bytes(text);
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  return "05" + "01" + paddedBytesLength + bytes;
}
