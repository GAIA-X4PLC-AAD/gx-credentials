/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import { issueCompanyCredential } from "../../lib/credentials";
import { CompanyApplication } from "@/types/CompanyApplication";
import axios from "axios";
import {
  getRegistrars,
  writeTrustedIssuerLog,
} from "@/lib/registryInteraction";
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";
import { getApplicationsFromDb } from "@/lib/database";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Modal,
  CircularProgress,
  TableContainer,
  Container,
  Chip,
} from "@mui/material";

export default function IssueCompany(props: any) {
  const [applications, setApplications] = React.useState<CompanyApplication[]>(
    props.pendingCompanyApplications,
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const handleAcceptCompanyIssuance = async (
    application: CompanyApplication,
  ) => {
    setIsProcessing(true); // Set processing state to true
    let credential = null;
    try {
      // Generate the credential using the didkit-wasm library
      credential = await issueCompanyCredential(application);
    } catch (error) {
      setIsProcessing(false);
      console.log("Error issuing credential: ", error);
      return;
    }

    await delay(2000);

    try {
      // write credential issuance to issuer registry
      await writeTrustedIssuerLog(application.address);
    } catch (error) {
      setIsProcessing(false);
      console.log("Error publishing credential to issuer registry: ", error);
      return;
    }

    // Update database with credential issuance
    axios
      .post("/api/publishCredential", {
        credential: credential,
        role: "company",
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

  const handleRejectCompanyIssuance = async (
    application: CompanyApplication,
  ) => {
    setIsProcessing(true); // Set processing state to true

    try {
      // Call the API to update the application status in the database
      const response = await axios.post("/api/updateApplicationStatusInDb", {
        collection: COLLECTIONS.COMPANY_APPLICATIONS,
        address: application.address,
        status: APPLICATION_STATUS.REJECTED,
      });

      // If the update was successful, update the state
      if (response.status === 200) {
        const updatedApplications = applications.map((app) => {
          if (app.address === application.address) {
            return { ...app, status: APPLICATION_STATUS.REJECTED };
          }
          return app;
        });
        setApplications(updatedApplications);
      }
    } catch (error) {
      console.error(
        "Could not update application Reject status in database",
        error,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        mb: 5,
        padding: "20px",
        maxWidth: { xs: "100%", sm: "75%", md: "md", lg: "lg", xl: "xl" }, // Adjust maxWidth for different screen sizes
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "primary.main", fontWeight: "bold" }}
      >
        Pending Company Applications
      </Typography>
      <Box
        sx={{
          borderRadius: "6px",
          boxShadow: 5,
          overflow: "auto",
          width: "100%",
        }}
      >
        <Table
          sx={{
            width: "100%",
            color: "primary.main",
            paddingX: { sm: "30px", md: "50px" }, // Adjust paddingX for different screen sizes
            paddingY: "30px",
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "" }}>
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
              >
                Description
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application.address}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{application.gx_id}</TableCell>
                <TableCell align="center">{application.name}</TableCell>
                <TableCell align="center">{application.address}</TableCell>
                <TableCell align="center">{application.description}</TableCell>
                <TableCell align="center">
                  {application.status === "pending" ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAcceptCompanyIssuance(application)}
                        disabled={isProcessing}
                        sx={{ mr: 1 }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRejectCompanyIssuance(application)}
                        disabled={isProcessing}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Chip
                      label={
                        application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)
                      }
                      color={
                        application.status === "approved" ? "success" : "error"
                      }
                      // sx={{
                      //   borderRadius: 1,
                      //   p: 1,
                      //   display: "inline-flex",
                      //   alignItems: "center",
                      //   justifyContent: "center",
                      // }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {isProcessing && (
        <Modal
          open={isProcessing}
          aria-labelledby="loading-modal-title"
          aria-describedby="loading-modal-description"
          closeAfterTransition
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Modal>
      )}
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const session = await getSession(context);
    const registrars = await getRegistrars();
    if (!session || !registrars) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (!registrars.includes(session.user?.pkh)) {
      return {
        redirect: {
          destination: "/common/unauthorised",
          permanent: false,
        },
      };
    }

    return {
      props: {
        pendingCompanyApplications: await getApplicationsFromDb(
          COLLECTIONS.COMPANY_APPLICATIONS,
        ),
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/common/error",
        permanent: false,
      },
    };
  }
}
