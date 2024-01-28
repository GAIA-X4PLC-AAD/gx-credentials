import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export const useErrorHandler = () => {
  const errorHandler = (error: Error, message?: string) => {
    // Log the error
    console.log(error);

    // Return a React element (JSX)
    return (
      <Stack spacing={2}>
        <Alert severity="error">{message || error.message}</Alert>
      </Stack>
    );
  };

  return { errorHandler };
};
