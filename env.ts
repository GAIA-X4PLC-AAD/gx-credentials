/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { joinPath } from "./utils/util";

const envs = ["development"];

export const environment = (locationHref: string) => {
  locationHref = getRootUrl(locationHref);
  return {
    requestComplianceEndpoint: (vcId?: string) =>
      joinPath(locationHref, "api", "credential-offers") +
      (vcId ? "?vcid=" + encodeURIComponent(vcId) : ""),

    requestExamplesEndpoint: joinPath(locationHref, "api", "getExamples"),
    requestClearingHousesEndpoint: joinPath(
      locationHref,
      "api",
      "clearing-houses",
    ),
    requestDidEndpoint: (didId: string, certchainUri?: string) =>
      joinPath(locationHref, "api", "credentials", didId) +
      (certchainUri ? "?certchainUri=" + certchainUri : ""),
    requestVCEndpoint: (vcId: string) =>
      joinPath(locationHref, "api", "credentials", vcId),
    requestWebauthnChallengeEndpoint: () =>
      joinPath(locationHref, "api", "webauthn", "challenge"),
    appPath: getRootUrl(locationHref).replace(/^https?:\/\/((?!\/).)+\/?/, ""),
    requestNotaryRegistrationNumberEndpoint: (
      props: { vcid: string } | { didId: string; uid: string; vcid: string },
    ) =>
      joinPath(locationHref, "api", "legalRegistrationNumber") +
      "?" +
      Object.entries(props)
        .map(([k, v]) => `${k}=${v}`)
        .join("&"),
    requestDecentralizedWebNode: (nodeUrl: string) =>
      joinPath(locationHref, "api", "decentralized-web-node") +
      ("?nodeUrl=" + nodeUrl),
    requestPrepareSignatureEndpoint: () =>
      joinPath(locationHref, "api", "webeid", "prepareSignature"),
    requestGetEIDJWSEndpoint: () =>
      joinPath(locationHref, "api", "webeid", "getEidJws"),
    requestCertChainEndpoint: (certId: string) =>
      joinPath(locationHref, "api", "certchain", certId),
    requestCESSubmitEndpoint: () => joinPath(locationHref, "api", "ces"),
    requestSparQLQuery: () =>
      joinPath(locationHref, "api", "policy-reasoning", "sparql-query"),
    insertRDF: () =>
      joinPath(locationHref, "api", "policy-reasoning", "insert-rdf"),
  };
};

export function getRootUrl(url: string): string {
  const regex = new RegExp(`^(https?:\/\/[^/]+)`);
  const matches = url.match(regex);
  const rootUrl = matches ? matches[1] : "";

  for (const env of envs) {
    if (url.startsWith(`${rootUrl}/${env}`)) {
      return `${rootUrl}/${env}`;
    }
  }

  if (url.startsWith(rootUrl)) {
    return "";
  }

  return rootUrl;
}
