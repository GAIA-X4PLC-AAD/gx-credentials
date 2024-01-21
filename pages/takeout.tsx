/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import Backdrop from "@mui/material/Backdrop";
import { NextPageContext } from "next";
import {
  getAddressRolesFromDb,
  getCredentialsFromDb,
  getApplicationsFromDb,
} from "../lib/database";
import { dAppClient } from "../config/wallet";
import { SigningType } from "@airgap/beacon-sdk";
import {
  ADDRESS_ROLES,
  APPLICATION_STATUS,
  COLLECTIONS,
} from "@/constants/constants";
import {
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import IssueEmployeeCredentialsTable from "../components/IssueEmployeeCredentialsTable";
import { EmployeeApplication } from "@/types/CompanyApplication";
import { issueEmployeeCredential } from "../lib/credentials";
import axios from "axios";
import { writeTrustedIssuerLog } from "@/lib/registryInteraction";
import DownloadIcon from "@mui/icons-material/Download";
import WalletIcon from "@mui/icons-material/Wallet";
import { ComplianceModal } from "@/components/ComplianceModal";

export default function Takeout(props: any) {
  const [applications, setApplications] = React.useState<EmployeeApplication[]>(
    props.pendingEmployeeApplications,
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState("Takeout");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // Show issuer's tab only if the user is a company
  const showIssuerTab = props.coll == COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS;

  // Method to download credential as JSON file
  const downloadCredential = (credential: any) => {
    const data = JSON.stringify(credential);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "VerifiableCredential.json";
    link.click();
  };

  // Method to transfer credential to wallet
  const transferCredentialToWallet = async () => {
    await dAppClient!.requestSignPayload({
      signingType: SigningType.RAW,
      payload:
        "Get your GX Credential! #" + props.apiHost + "/api/takeoutCredential",
    });
  };

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  // Method to handle accept issue employee credential click
  const handleEmployeeIssuance = async (application: EmployeeApplication) => {
    setIsProcessing(true); // Set processing state to true
    let credential = null;
    try {
      // Issue credential
      credential = await issueEmployeeCredential(application);
      console.log("credential: ", credential);
    } catch (error) {
      console.log("Error issuing credential: ", error);
      setIsProcessing(false);
      return;
    }

    await delay(2000);

    try {
      // write credential issuance to issuer registry
      await writeTrustedIssuerLog(application.address);
    } catch (error) {
      console.log("Error publishing credential to issuer registry: ", error);
      setIsProcessing(false);
      return;
    }

    // Update database with credential issuance
    axios
      .post("/api/publishCredential", {
        credential: credential,
        role: "employee",
      })
      .then(async function (response) {
        application.status = APPLICATION_STATUS.APPROVED;
        const updatedApplications = applications.map((app) => {
          if (app.address === application.address) {
            return application;
          }
          return app;
        });
        setApplications(updatedApplications);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  // Method to handle reject employee issuance click
  const handleRejectEmployeeIssuance = async (
    application: EmployeeApplication,
  ) => {
    setIsProcessing(false);
    try {
      // Call the API to update the application status in the database
      const response = await axios.post("/api/updateApplicationStatusInDb", {
        collection: COLLECTIONS.EMPLOYEE_APPLICATIONS,
        address: application.address,
        status: APPLICATION_STATUS.REJECTED,
      });
      if (response.status === 200) {
        application.status = APPLICATION_STATUS.REJECTED;
        const updatedApplications = applications.map((app) => {
          if (app.address === application.address) {
            return application;
          }
          return app;
        });
        setApplications(updatedApplications);
      }
    } catch (error) {
      console.log("Error updating application status: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const takeoutCredential = (
    <Table
      sx={{
        width: "100%",
        paddingX: { sm: "30px", md: "50px" }, // Adjust paddingX for different screen sizes
        paddingY: "30px",
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            GX ID
          </TableCell>
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Company Name
          </TableCell>
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Public Key Hash
          </TableCell>
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          ></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.userCredentials.map((credential: any) => (
          <TableRow
            key={credential.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell align="center" sx={{ color: "primary.main" }}>
              {
                credential.credentialSubject["gx:legalRegistrationNumber"][
                  "gx:vatID"
                ]
              }
            </TableCell>
            <TableCell align="center" sx={{ color: "primary.main" }}>
              {credential.credentialSubject["gx:legalName"]}
            </TableCell>
            <TableCell align="center" sx={{ color: "primary.main" }}>
              {credential.credentialSubject.id}
            </TableCell>
            <TableCell align="center" sx={{ color: "primary.main" }}>
              <Button
                onClick={transferCredentialToWallet}
                variant="contained"
                startIcon={<WalletIcon />}
              >
                Beacon Wallet
              </Button>
              <Button
                onClick={() => downloadCredential(credential)}
                variant="contained"
                sx={{
                  m: 1,
                }}
                startIcon={<DownloadIcon />}
              >
                Raw Download
              </Button>
              <ComplianceModal credential={props.userCredentials} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Box sx={{ mt: 2.5, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: "90%" }, // 100% on extra-small to medium screens, 80% on medium screens and above
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab value="Takeout" label="Takeout" />
          {showIssuerTab && <Tab value="Issue" label="Issue" />}
        </Tabs>

        <Box role="tabpanel" hidden={tabValue !== "Takeout"}>
          {tabValue === "Takeout" && (
            <Box
              sx={{
                overflow: "auto",
                mt: 2,
                borderRadius: "6px",
                boxShadow: 5,
                width: "100%",
              }}
            >
              {takeoutCredential}
            </Box>
          )}
        </Box>

        <Box role="tabpanel" hidden={tabValue !== "Issue"}>
          {tabValue === "Issue" && (
            <IssueEmployeeCredentialsTable
              props={{
                applications: applications,
                handleEmployeeIssuance: handleEmployeeIssuance,
                handleRejectEmployeeIssuance: handleRejectEmployeeIssuance,
              }}
            />
          )}
        </Box>
      </Box>

      <Modal
        open={isProcessing}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Modal>
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const addressRole: any = await getAddressRolesFromDb(session.user!.pkh);
  const role = addressRole
    ? Array.isArray(addressRole)
      ? addressRole[0].role
      : addressRole.role
    : null;
  let coll = "";
  if (role === ADDRESS_ROLES.COMPANY_APPROVED) {
    coll = COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS;
  } else if (role === ADDRESS_ROLES.EMPLOYEE_APPROVED) {
    coll = COLLECTIONS.TRUSTED_EMPLOYEE_CREDENTIALS;
  } else {
    return {
      redirect: {
        destination: "/common/unauthorised",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userCredentials: (
        await getCredentialsFromDb(coll, session.user!.pkh)
      ).map((wrapper: any) => wrapper.credential),
      pendingEmployeeApplications: await getApplicationsFromDb(
        COLLECTIONS.EMPLOYEE_APPLICATIONS,
        session.user!.pkh,
      ),
      coll,
      apiHost: process.env.GLOBAL_SERVER_URL,
    },
  };
}
