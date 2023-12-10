import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff", // white color for primary palette
    },
    background: {
      default:
        "linear-gradient(to bottom right, #B900FF -5%, #000094 85%, #46DAFF 110%)",
    },
  },
});

export default theme;
