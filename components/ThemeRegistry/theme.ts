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
});

export default theme;
