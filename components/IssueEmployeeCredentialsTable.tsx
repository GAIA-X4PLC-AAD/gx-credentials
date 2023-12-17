/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { EmployeeApplication } from "@/types/CompanyApplication";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const IssueEmployeeCredentialsTable = (props: any) => {
  const applications = props?.props.applications as EmployeeApplication[];
  const handleEmployeeIssuance = props?.props.handleEmployeeIssuance;
  const handleRejectEmployeeIssuance =
    props?.props.handleRejectEmployeeIssuance;

  return (
    <Box sx={{ overflow: "auto", width: "100%" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "primary.main", mt: 2 }}
      >
        Employee Applications
      </Typography>
      <Box
        sx={{
          overflow: "auto",
          my: 2,
          mx: 1,
          borderRadius: "6px",
          boxShadow: 5,
        }}
      >
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
                Employee Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                Employee Name
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
                Address
              </TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications &&
              applications.map((application) => (
                <TableRow
                  key={application.address}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    color: "primary.main",
                  }}
                >
                  <TableCell align="center" sx={{ color: "primary.main" }}>
                    {application.employeeId}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "primary.main" }}>
                    {application.name}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "primary.main" }}>
                    {application.companyName}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "primary.main" }}>
                    {application.address}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "primary.main" }}>
                    {application.status === "pending" ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                        }}
                      >
                        <Button
                          onClick={() => handleEmployeeIssuance(application)}
                          variant="contained"
                          color="success"
                          sx={{ m: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() =>
                            handleRejectEmployeeIssuance(application)
                          }
                          sx={{ m: 1 }}
                          variant="contained"
                          color="error"
                        >
                          Reject
                        </Button>
                      </Box>
                    ) : application.status === "approved" ? (
                      <Chip label="Approved" color="success" variant="filled" />
                    ) : (
                      <Chip label="Rejected" color="error" variant="filled" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default IssueEmployeeCredentialsTable;
