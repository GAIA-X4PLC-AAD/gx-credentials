/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import ContentCard from "./ContentCard";

const CredentialCard = (props: any) => {
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
