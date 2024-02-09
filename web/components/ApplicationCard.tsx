/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import ContentCard from "./ContentCard";

const ApplicationCard = (props: any) => {
  const application = props.application;
  const applicationType = application.role
    ? "Employee Application"
    : "Company Application";

  return (
    <>
      <ContentCard
        title={'Application as "' + application.legalName + '"'}
        subtitle={applicationType}
      >
        {application.registrationNumber && (
          <div>
            <p className="mt-3 font-normal text-gray-500">
              <i>Tezos Address:</i>
              <br /> {application.address}
            </p>
            <p className="mt-3 font-normal text-gray-500">
              <i>Registration Number:</i> {application.registrationNumber}
            </p>
            <p className="font-normal text-gray-500">
              <i>Headquarter Address:</i> {application.headquarterAddress}
            </p>
            <p className="font-normal text-gray-500">
              <i>Legal Address:</i> {application.legalAddress}
            </p>
            <p className="font-normal text-gray-500">
              <i>Parent Org:</i> {application.parentOrganization}
            </p>
            <p className="font-normal text-gray-500">
              <i>Sub Org:</i> {application.subOrganization}
            </p>
          </div>
        )}
        {application.role && (
          <div>
            <p className="mt-3 font-normal text-gray-500">
              <i>Tezos Address:</i>
              <br /> {application.address}
            </p>
            <p className="mt-3 font-normal text-gray-500">
              <i>Role:</i> {application.role}
            </p>
            <p className="font-normal text-gray-500">
              <i>Email:</i> {application.email}
            </p>
          </div>
        )}
        <p className="mb-3 mt-3 font-normal text-gray-500">
          <i>Application Text:</i>
          <br />
          {application.applicationText}
        </p>
        <p className="mb-3 font-normal text-gray-500">
          {new Date(parseInt(application.timestamp)).toISOString()}
        </p>
        {props.children}
      </ContentCard>
    </>
  );
};

export default ApplicationCard;
