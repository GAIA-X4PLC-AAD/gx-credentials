/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { Box } from "@mui/material";
import React from "react";

function rejected() {
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
        {" "}
        Your application has been rejected. Please contact the concerned
        authorities.
      </b>
    </Box>
  );
}

export default rejected;
