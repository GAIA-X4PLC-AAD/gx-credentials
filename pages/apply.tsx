/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { getRegistrars } from "../lib/registryInteraction";
import { getAddressRolesFromDb } from "@/lib/database";
import { ADDRESS_ROLES } from "@/constants/constants";
import { Box, Button, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";

export default function Apply() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "80%",
      }}
    >
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: 15,
            color: "primary.main",
            margin: 2,
          }}
        >
          You are still unknown to our system. Do you wish to apply for a
          specific credential?
        </Typography>
      </Box>
      <Box>
        <Button
          component={Link}
          href="/apply/applyAsCompany"
          sx={{ textDecoration: "none", margin: 1 }} // Add margin for spacing
          variant="contained"
          color="success"
          startIcon={<BusinessIcon />}
        >
          Apply as Company
        </Button>
        <Button
          component={Link}
          href="/apply/applyAsEmployee"
          sx={{ textDecoration: "none", margin: 1 }} // Add margin for spacing
          variant="contained"
          color="success"
          startIcon={<PersonIcon />}
        >
          {" "}
          Apply as Employee
        </Button>
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    console.log("No session found.");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const registrars = await getRegistrars();
  if (registrars.includes(session.user.pkh)) {
    return {
      redirect: {
        destination: "/issue/issueCompany",
        permanent: false,
      },
    };
  }

  // TODO should first redirect to issuance page for companies with optional link to cred takeout
  const addressRole: any = await getAddressRolesFromDb(session.user.pkh);
  if (addressRole) {
    const role = Array.isArray(addressRole)
      ? addressRole[0].role
      : addressRole.role;

    if (
      role === ADDRESS_ROLES.COMPANY_APPROVED ||
      role === ADDRESS_ROLES.EMPLOYEE_APPROVED
    ) {
      return {
        redirect: {
          destination: "/takeout",
          role: role,
          permanent: false,
        },
      };
    } else if (
      role === ADDRESS_ROLES.COMPANY_APPLIED ||
      role === ADDRESS_ROLES.EMPLOYEE_APPLIED
    ) {
      return {
        redirect: {
          destination: "/common/pending",
          permanent: false,
        },
      };
    } else if (
      role === ADDRESS_ROLES.COMPANY_REJECTED ||
      role === ADDRESS_ROLES.EMPLOYEE_REJECTED
    ) {
      return {
        redirect: {
          destination: "/common/rejected",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
