import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff", // white color for primary palette
    },
    background: {
      default:
        "linear-gradient(to bottom right, #B900FF -5%, #000094 85%, #46DAFF 110%)",
      paper:
        "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(188,78,156,1) 39%, rgba(252,70,107,1) 95%)",
    },
  },
  breakpoints: {
    values: {
      xs: 0, // extra-small
      sm: 600, // small
      md: 900, // medium
      lg: 1200, // large
      xl: 1536, // extra-large
    },
  },
  components: {
    MuiButton: {
      // Define styles for different button sizes
      styleOverrides: {
        sizeSmall: {
          // Custom styles for small buttons
          padding: "6px 12px",
          fontSize: "75px",
        },
        sizeLarge: {
          // Custom styles for large buttons
          padding: "10px 20px",
          fontSize: "0.875rem",
        },
      },
    },
  },
});

export default theme;
