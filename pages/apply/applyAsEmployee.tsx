/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import axios from "axios";
import { getTrustedIssuersFromDb } from "@/lib/database";
import { useRouter } from "next/router";
import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
  CircularProgress,
  Typography,
} from "@mui/material";

export default function ApplyAsEmployee(props: any) {
  const { data: session } = useSession();

  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setCompanies(props.issuers);
  }, [props.issuers]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault(); // avoid default behaviour
    axios
      .post("/api/applyAsEmployee", {
        name: name,
        employeeId: employeeId,
        companyId: companyId,
        companyName: companyName,
      })
      .then(function (response) {
        console.log(response);
      })
      .then(() => {
        router.push("/common/pending");
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const form = () => {
    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          color: "primary.main",
          borderRadius: "6px",
          boxShadow: "20",
          paddingX: { xs: "20px", md: "50px" },
          paddingY: "30px",
        }}
      >
        {/* Full Name Field */}
        <FormControl fullWidth margin="normal">
          <FormLabel htmlFor="inline-full-name" sx={{ color: "primary.main" }}>
            Full Name
          </FormLabel>
          <TextField
            required
            id="inline-full-name"
            type="text"
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 1, input: { color: "primary.main" } }}
          />
        </FormControl>

        {/* Employee ID Field */}
        <FormControl fullWidth margin="normal">
          <FormLabel htmlFor="inline-gx-id" sx={{ color: "primary.main" }}>
            Employee ID
          </FormLabel>
          <TextField
            required
            id="inline-gx-id"
            type="text"
            variant="outlined"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            sx={{ mt: 1, input: { color: "primary.main" } }}
          />
        </FormControl>

        {/* Company Name Field */}
        <FormControl fullWidth margin="normal">
          <FormLabel
            htmlFor="inline-company-name"
            sx={{ color: "primary.main" }}
          >
            Company Name
          </FormLabel>
          <Select
            required
            id="inline-company-name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              const selectedCompany = companies.find(
                (company) => company[0] === e.target.value,
              );
              if (selectedCompany) {
                setCompanyId(selectedCompany[1]);
              }
            }}
            sx={{ mt: 1, input: { color: "primary.main" } }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a company
            </MenuItem>
            {companies.map((company) => (
              <MenuItem key={company[1]} value={company[0]}>
                {company[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Address Field */}
        <FormControl fullWidth margin="normal">
          <FormLabel htmlFor="inline-address" sx={{ color: "primary.main" }}>
            Address
          </FormLabel>
          <TextField
            required
            id="inline-address"
            type="text"
            value={session?.user?.pkh}
            InputProps={{ readOnly: true }}
            variant="outlined"
            sx={{ mt: 1, input: { color: "primary.main" } }}
          />
        </FormControl>

        {/* Submit Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            color="success"
            sx={{ boxShadow: "20" }}
          >
            Apply for Employee Registration
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: 10,
        padding: "20px",
      }}
    >
      <Modal
        open={isLoading}
        aria-labelledby="loading-modal-title"
        aria-describedby="loading-modal-description"
        closeAfterTransition
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <CircularProgress />
        </Box>
      </Modal>
      <Box maxWidth="md" sx={{ mt: 5, color: "primary.main" }}>
        <Typography variant="h4" gutterBottom>
          Register as an Employee
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "primary.main" }}>
          Register as an Employee for one of the registered companies.
        </Typography>
        {form()}
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  console.log("session", session);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const issuers = await getTrustedIssuersFromDb();
  const issuerList = Array.from(issuers.entries());
  return {
    props: {
      issuers: issuerList,
    },
  };
}
