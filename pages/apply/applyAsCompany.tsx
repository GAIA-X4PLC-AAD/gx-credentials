/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../../hooks/useProtected";
import axios from "axios";
import { useRouter } from "next/router";
import {
  FormControl,
  TextField,
  TextareaAutosize,
  Button,
  Box,
  FormLabel,
  Typography,
  CircularProgress,
  Modal,
} from "@mui/material";
import { Container } from "postcss";

export default function ApplyAsCompany() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [gx_id, setGX_ID] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault(); // avoid default behaviour
    setIsLoading(true); // Set loading state to true

    axios
      .post("/api/applyAsCompany", {
        name: name,
        gx_id: gx_id,
        description: description,
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
      <>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            color: "primary.main",
            borderRadius: "6px",
            boxShadow: "20",
            paddingX: { xs: "20px", md: "50px" }, // Add padding for spacing
            paddingY: "30px",
          }}
        >
          <FormControl fullWidth margin="normal">
            <FormLabel
              htmlFor="inline-full-name"
              sx={{ color: "primary.main" }}
            >
              Full Name
            </FormLabel>
            <TextField
              required
              id="inline-full-name"
              type="text"
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              sx={{
                mt: 1,
                input: { color: "primary.main" },
              }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="inline-gx-id" sx={{ color: "primary.main" }}>
              GX ID
            </FormLabel>
            <TextField
              required
              id="inline-gx-id"
              type="text"
              variant="outlined"
              onChange={(e) => setGX_ID(e.target.value)}
              sx={{ mt: 1, input: { color: "primary.main" } }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel
              htmlFor="inline-description"
              sx={{ color: "primary.main" }}
            >
              Description
            </FormLabel>
            <TextField
              required
              id="inline-description"
              type="text"
              variant="outlined"
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mt: 1, input: { color: "primary.main" } }}
            />
          </FormControl>

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
              Apply for Company Registration
            </Button>
          </Box>
        </Box>
      </>
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
          Register Your Company
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "primary.main" }}>
          Registering your company here will allow you to issue employee
          credentials to your employees that are trusted by all other members of
          this consortium. For convenience, issuers can optionally use this web
          application to handle the process of issuing employee credentials.
        </Typography>
        {form()}
      </Box>
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
  return {
    props: {},
  };
}
