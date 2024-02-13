/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import ContentCard from "./ContentCard";

const CredentialCard = (props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrappedCredential: any;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const wrappedCredential = props.wrappedCredential;
  const credentialType = wrappedCredential.role
    ? "Employee Credential"
    : "Company Credential";

  return (
    <>
      <ContentCard
        title={wrappedCredential.credential.credentialSubject["gx:legalName"]}
        subtitle={credentialType}
      >
        {props.children}
      </ContentCard>
    </>
  );
};

export default CredentialCard;
