"use client";

import { createTheme } from "@mui/material";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
});

const theme = createTheme({
  cssVariables: true,
  colorSchemes: { dark: true },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
