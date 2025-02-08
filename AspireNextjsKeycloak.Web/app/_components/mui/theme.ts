"use client";

import { createTheme } from "@mui/material";

const theme = createTheme({
  cssVariables: true,
  colorSchemes: { dark: true },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
