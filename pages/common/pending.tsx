/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { Box } from "@mui/material";
import React from "react";

function pending() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 30,
      }}
    >
      <b>
        Thank you for submitting your request. Your request is under review.
      </b>
    </Box>
  );
}

export default pending;
