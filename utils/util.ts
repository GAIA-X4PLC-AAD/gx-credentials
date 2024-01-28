/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
export function joinPath(host: string, ...path: string[]): string {
  if (!path.length) {
    return host;
  }
  const p = path[0];
  let resolved: string;
  if (host.endsWith("/")) {
    resolved = p.startsWith("/") ? host + p.substring(1) : host + p;
  } else {
    resolved = p.startsWith("/") ? host + p : host + "/" + p;
  }
  if (path.length === 1) {
    return resolved;
  }
  return joinPath(resolved, ...path.slice(1));
}
